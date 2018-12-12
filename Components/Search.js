// Components/Search.js
import React from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'

//import films from '../Helpers/filmsData';
import FilmItem from './FilmItem'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'

class Search extends React.Component {
  constructor(props){
    super(props);
    // this._films = [];
    this.searchedText = '';
    this.page = 0 // Compteur pour connaître la page courante
    this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
    this.state = {
      films: [],
      isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
    }
    this._loadFilms = this._loadFilms.bind(this)
  }

  _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
            {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
          </View>
        )
      }
    }

  _searchTextInputChanged(text) {
     this.searchedText = text;
  }

  _loadFilms(){
    // getFilmsFromApiWithSearchedText("star").then(data => {
    //   this.setState({ films: data.results })
    // });

    console.log(this.searchedText) // Un log pour vérifier qu'on a bien le texte du TextInput
    if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [...this.state.films, ...data.results],
          isLoading: false
        })
      })
    }
  }

  _searchFilms(){
    this.page = 0
    this.totalPages = 0
    // this.setState({
    //   films: []
    // })
    // // J'utilise la paramètre length sur mon tableau de films pour vérifier qu'il y a bien 0 film
    // console.log("Page : " + this.page + " / TotalPages : " + this.totalPages +
    // " / Nombre de films : " + this.state.films.length)
    this.setState({
      films: [],
        }, () => {
          console.log("Page : " + this.page + " / TotalPages : " + this.totalPages
          + " / Nombre de films : " + this.state.films.length)
          this._loadFilms()
    })
  }


  render() {
    console.log(this.props)
    return (
      <View style={styles.main_container}>
        <TextInput
          placeholder="titre du film"
          style={[ styles.textinput]}
          onChangeText={(text) => this._searchTextInputChanged(text)}
          onSubmitEditing={() => this._searchFilms()}
        />
        <Button
          title='Rechercher'
          onPress={() => this._searchFilms()}
          style={{height: 50}}
        />
        <FilmList
          films={this.state.films}
          navigation={this.props.navigation}
          loadFilms={this._loadFilms}
          page={this.page}
          totalPages={this.totalPages}
          favoriteList={false}
        />
        {this._displayLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 20
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})


export default Search
