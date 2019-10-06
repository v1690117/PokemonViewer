import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, Image, View, Button, TouchableHighlight, Vibration, Alert } from 'react-native';
import { Card } from 'react-native-elements'
const PATTERN = [100, 500, 100];
const POKE_NUMBER = 5

const Pokecard = props => <Card key={Math.random()}
  title={`${props.id} - ${props.name}`}>
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 2 }}>
      <TouchableHighlight
        underlayColor='white'
        style={{
          alignItems: 'center',
          padding: 10
        }}
        onPress={() => {
          Vibration.vibrate(PATTERN);
          Alert.alert('A-A-A-A-A-A', 'Don`t touch me!');
        }}>
        <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: props.sprites.front_default }}
        />
      </TouchableHighlight>
    </View>
    <View style={{ flex: 4 }}>
      <Text style={{ marginBottom: 10 }}>
        Weight: {props.weight}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        Height: {props.height}
      </Text>
      {
        props.stats.map(s => <Text style={{ marginBottom: 10 }} key={Math.random()}>
          {s.stat.name}: {s.base_stat}
        </Text>)
      }
    </View>
  </View>
</Card>

type AppState = {
  data: [],
  page: number
}

const get = relativeUrl => fetch(`https://pokeapi.co/api/v2/${relativeUrl}`).then(r => r.json())
// add lazy load

export default function () {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0)

  useEffect(() => {
    fetchData(page, setData)
  })

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
      {data.map(obj => <Pokecard {...obj} key={Math.random()} />)}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8
      }}>
        <Button onPress={() => setPage(page == 0 ? page : page - 1)} title="Previous" />
        <Button onPress={() => setPage(page + 1)} title="Next" />
      </View>
    </ScrollView>
  );
}

function fetchData(page, callback) {
  get(`pokemon?limit=${POKE_NUMBER}&offset=${POKE_NUMBER * page}`)
    .then(data => Promise.all(data.results.map(pokemon => get(`pokemon/${pokemon.name}`))))
    .then(callback)
    .catch(console.log)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
