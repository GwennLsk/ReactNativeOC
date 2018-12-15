// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, ActivityIndicator, ScrollView, Image, Text, Button, TouchableOpacity, Share, Alert, Platform } from 'react-native'
import { getImageFromApi, getFilmDetailFromApi } from '../API/TMDBApi'
import numeral from 'numeral'
import moment from 'moment'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

  
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
    if (params.film != undefined && Platform.OS === 'ios') {
      return {
          // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
          headerRight: <TouchableOpacity
                          style={styles.share_touchable_headerrightbutton}
                          onPress={() => params.shareFilm()}>
                          <Image
                            style={styles.share_image}
                            source={require('../Images/ic_share.png')} />
                        </TouchableOpacity>
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
      
    }
    this._toggleFavorite = this._toggleFavorite.bind(this)
    this._shareFilm = this._shareFilm.bind(this)
  }

   // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
   _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    })
  }

  // Dès que le film est chargé, on met à jour les paramètres de la navigation (avec la fonction _updateNavigationParams) pour afficher le bouton de partage
  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) { 
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
      }, () => { this._updateNavigationParams() })
      return
    }
    // Le film n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({ isLoading: true })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams() })
      })
  }


  componentDidUpdate() {
    console.log("componentDidUpdate : ")
    console.log(this.props.favoritesFilm)
  }

  _displayLoading() {
    if (this.state.isLoading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={styles.loading_container}>
        <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _toggleFavorite(){
    const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
    this.props.dispatch(action)
  }

  _displayFilm() {
    // console.log(this.state.film)
    const { film } = this.state
    if (this.state.film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image
            style={styles.image}
            source={{uri: getImageFromApi(film.backdrop_path)}}
          />
        <Text style={styles.film_title}>{this.state.film.title}</Text>
        <TouchableOpacity
          style={styles.favorite_container}
          title="Favoris"
          onPress={() => this._toggleFavorite()}>
          {this._displayFavoriteImage()}
        </TouchableOpacity>
        <Text style={styles.film_description}> {film.overview}</Text>
        <View>
          <Text> sorti le: {moment(film.release_date).format('DD/MM/YYYY')} </Text>
          <Text> vote:  { film.vote_average }/10 </Text>
          <Text> nombre de vote: {film.vote_count}</Text>
          <Text> budget: {numeral(film.budget).format('0,0[.]00 $')} </Text>
          <Text> genre: {film.genres.map(function(genre){
              return genre.name;
            }).join(" / ")}</Text>
          <Text> compagnie(s): {film.production_companies.map(function(company){
              return company.name;
            }).join(" / ")}</Text>
        </View>
          {/* Pour l'instant je n'affiche que le titre, je vous laisserais le soin de créer la vue. Après tout vous êtes aussi là pour ça non ? :)*/}
        </ScrollView>
      )
    }
  }

  _displayFavoriteImage() {
      var sourceImage = require('../Images/ic_favorite_border.png')
      var shouldEnlarge = false
      if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
        // Film dans nos favoris
        sourceImage = require('../Images/ic_favorite.png')
        shouldEnlarge = true
      }
      return (
        <EnlargeShrink shouldEnlarge={shouldEnlarge}>
          <Image
            style={styles.favorite_image}
            source={sourceImage}
          />
        </EnlargeShrink>
      )
  }

  _shareFilm() {
    const { film } = this.state
    Share.share({ title: film.title, message: film.overview })
      .then(
        Alert.alert(
          'Succès',
          'Film partagé',
          [
            {text: 'OK', onPress: () => {}},
          ]
        )
      )
      .catch(err =>
        Alert.alert(
          'Echec',
          'Film non partagé',
          [
            {text: 'OK', onPress: () => {}},
          ]
        )
      )
  }

  
  _displayFloatingActionButton() {
    const { film } = this.state
    if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../Images/ic_share.png')} />
        </TouchableOpacity>
      )
    }
  }

  render() {
    console.log(this.props)
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
        {this._displayFloatingActionButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  image: {
    height: 169,
    margin: 5
  },
  film_title: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 30,
    margin: 10
  },
  film_description: {
    margin: 5,
    color: 'grey'
  },
  favorite_container: {
    alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  },
  share_touchable_headerrightbutton: {
    marginRight: 8
  },
  favorite_image:{
    flex: 1,
    width: null,
    height: null
  }
})

const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)
