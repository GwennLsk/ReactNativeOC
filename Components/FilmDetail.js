// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, ActivityIndicator, ScrollView, Image, Text, Button, TouchableOpacity } from 'react-native'
import { getImageFromApi, getFilmDetailFromApi } from '../API/TMDBApi'
import numeral from 'numeral'
import moment from 'moment'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
    }
  }


  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
      })
      return
    }
    // Le film n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({ isLoading: true })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      })
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
      if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
        // Film dans nos favoris
        sourceImage = require('../Images/ic_favorite.png')
      }
      return (
        <Image
          style={styles.favorite_image}
          source={sourceImage}
        />
      )
  }

  render() {
    console.log(this.props)
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
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
