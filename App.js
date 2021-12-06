import React, { Component } from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, Touchable, Button } from 'react-native';
import { GiftedChat, Composer } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent } from '@react-native-voice/voice';

import { dialogflowConfig } from './env';

const BOT_USER = {
  _id: 2,
  name: 'Fitness Bot',
  avatar: {uri: 'jerry.png'}
};

class App extends Component {

  state = {
    messages: [
      {
        _id: 1,
        text: `Hi. I am Jerry, your personal fitness assistant. Ask me to recommend an exercise!`,
        createdAt: new Date(),
        user: BOT_USER
      }
    ]
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg])
    }));
  }

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

  renderComposer = (props) => {
    // Adds a Mic Button in the text box, you can style it as you want
    return (
      <View style={{ flexDirection: 'row' }}>
       <Composer {...props} />
       <TouchableOpacity
          style={styles.button}
          onPressIn={this.onSpeech}
          onPressOut={this.onSpeechEnd}
        >
          <Text>Voice</Text> 
        </TouchableOpacity>
      </View>
     )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          renderComposer = {this.renderComposer}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});

export default App;