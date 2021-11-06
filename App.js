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

class App extends Component {

  state = {
    lastInput: '',
    lastOutput: ''
  }

  constructor(props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults;
  }

  onSpeech = async () => {
    // begin listening
    this.setState({lastInput:''});
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
    } catch (error) {
      console.error(error);
    }
    str = "input was " + this.state.lastInput;
    Tts.speak(str);
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