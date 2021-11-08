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

  private_key = secrets.private_key;
  client_email = secrets.client_email;

  constructor(props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults;

    Dialogflow_V2.setConfiguration(
      this.client_email,
      this.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      this.state.projId
    );

    Tts.setDefaultVoice("com.apple.ttsbundle.siri_male_en-US_compact");
    Tts.setDefaultRate(0.55);
  }

  resultHandler = (result) => {
    this.setState({
        lastOutput: result.queryResult.fulfillmentText,
    });
    Tts.speak(this.state.lastOutput);
  };

  onSpeech = async () => {
    // begin listening
    this.setState({
      lastInput: '',
    });
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

      let str = this.state.lastInput;
      await Dialogflow_V2.requestQuery(str.toString(), result=>{this.resultHandler(result)}, error=>console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  onSpeechResults = (e) => {
    this.setState({
      lastInput: e.value,
    });
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