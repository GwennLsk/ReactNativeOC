// Component/FilmItem.js

import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {getImageFromApi} from '../API/TMDBApi'
import FadeIn from '../Animations/FadeIn'


class FilmItem extends React.Component {
  _displayFavoriteImage() {
     if (this.props.isFilmFavorite) {
       // Si la props isFilmFavorite vaut true, on affiche le 🖤
       return (
         <Image
           style={styles.favorite_image}
           source={require('../Images/ic_favorite.png')}
         />
       )
     }
  }
  render() {
    const {film, displayDetailForFilm} = this.props
    // console.log(this.props)
    return (
      <FadeIn>
        <TouchableOpacity
          style={styles.main_container}
          onPress={() => displayDetailForFilm(film.id)}>
          <Image style={styles.image} source={{
              uri: getImageFromApi(film.poster_path)
            }}/>
          <View style={styles.film_description}>
            <View style={styles.header_container}>
              {this._displayFavoriteImage()}
              <Text style={styles.title_text}>{film.title}</Text>
              <Text style={styles.vote_text}>
                {film.vote_average}
              </Text>
            </View>
            <View style={styles.description_container}>
              <Text style={styles.description_text} numberOfLines={6}>
                {film.overview}
              </Text>
            </View>
            <View style={styles.date_container}>
              <Text style={styles.date_text}>
                sorti le: {film.release_date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </FadeIn>
    );
  }
};

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#e0e0e0',
    padding: 5
  },
  image: {
    flex: 1
  },
  film_description: {
    flex: 2,
    paddingLeft: 10
  },
  header_container: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title_text: {
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex: 5
  },
  vote_text: {
    color: 'grey',
    fontSize: 20,
    flex: 1
  },
  description_container: {
    flex: 4
  },
  description_text: {
    color: 'grey'
  },
  date_container: {
    flex: 1
  },
  date_text: {
    alignSelf: 'flex-end'
  },
  favorite_image: {
    width: 25,
    height: 25,
    marginRight: 5
  }
});

export default FilmItem;
