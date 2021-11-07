import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Tts from 'react-native-tts';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent
} from '@react-native-voice/voice';
import { Dialogflow_V2 } from 'react-native-dialogflow';
var secrets = require('./secrets/sds-project-agent-xywc-6538f49e0789.json');


class App extends Component {

  state = {
    lastInput: '',
    lastOutput: '',
    sessId:  1,
    projId: 'sds-project-agent-xywc',
    langCode: 'en-US'
  }

<<<<<<< HEAD
=======
  private_key = secrets.private_key;
  client_email = secrets.client_email;

>>>>>>> 7b29699 (Removed plaintext secrets)
  constructor(props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults;
  }

  getResponse = async (query) => {
    const ACCESS_TOKEN = 'G0CSPX-lxqmZUj0RkZ8d0taIChqqN_jQEqr'
    const url = 'https://dialogflow.googleapis.com/v2/projects/'+this.state.projId+'agent/sessions/'+this.state.sessId+':detectIntent'
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body : JSON.stringify({
        queryInput: {
          text: {
            text: query,
            languageCode: this.state.langCode,
          },
        },
      })
    };

    try {
      const response = await fetch(url, req);
      let responseJson = await response.json();
      this.state.sessId += 1;
      return responseJson.queryResult.queryText;
    } catch (err) {
      console.error(err);
    }
  }

  onSpeech = async () => {
    // begin listening
    this.state.lastInput = '';
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  onSpeechEnd = async () => {
    // give a response
    try {
      await Voice.stop();

      const response = await this.getResponse(this.state.lastInput);
    } catch (error) {
      console.error(error);
    }
    Tts.speak(response);
  };

  onSpeechResults = (e) => {
    this.state.lastInput = e.value;
  };

  render(){
    return (
      <View 
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onSpeech}
        >
          <Text>Press here to speak.</Text> 
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onSpeechEnd}
        >
          <Text>Press here to get a response.</Text> 
        </TouchableOpacity>
      </View> 
    )
  };
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});

export default App;