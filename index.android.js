/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Button from 'react-native-button';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ListView
} from 'react-native';

var domoticzUnits = {
    "UT": { name: "Utility", ip4: "192.168.0.232" },
    "PLC": { name: "Pipes", ip4: "192.168.0.233" },
    "CEL": { name: "Cellar", ip4: "192.168.0.234" },
    "OFF": { name: "Office", ip4: "192.168.0.235" },
    "KIT": { name: "Kitchen", ip4: "192.168.0.236" },
    "FRONT": { name: "Front Door", ip4: "192.168.0.221"}
}
var scenes = [
  { name: 'Nighttime', action: 'Off', cmds: [ { unit: "UT", cmdIdx: 6 }, { unit: "PLC", cmdIdx: 6 }, { unit: "CEL", cmdIdx: 6 }, { unit: "OFF", cmdIdx: 6 }, { unit: "KIT", cmdIdx: 6 } ] },
  { name: 'Hall', action: 'Off', cmds: [ { unit: "UT", cmdIdx: 5 }, { unit: "PLC", cmdIdx: 21 }, { unit: "CEL", cmdIdx: 5 }, { unit: "OFF", cmdIdx: 5 }, { unit: "KIT", cmdIdx: 21 } ] },
  { name: 'Hall', action: 'Mood', cmds: [ { unit: "UT", cmdIdx: 4 }, { unit: "PLC", cmdIdx: 20 }, { unit: "CEL", cmdIdx: 4 }, { unit: "OFF", cmdIdx: 4 }, { unit: "KIT", cmdIdx: 20 } ] },
  { name: 'Hall', action: 'Bright', cmds: [ { unit: "UT", cmdIdx: 3 }, { unit: "PLC", cmdIdx: 19 }, { unit: "CEL", cmdIdx: 3 }, { unit: "OFF", cmdIdx: 3 }, { unit: "KIT", cmdIdx: 19 } ] },
  { name: 'Kitchen', action: 'Bright', cmds: [ { unit: "PLC", cmdIdx: 22 }, { unit: "KIT", cmdIdx: 22 } ] },
  { name: 'Kitchen', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 23 }, { unit: "CEL", cmdIdx: 13 }, { unit: "KIT", cmdIdx: 23 } ] },
  { name: 'Kitchen', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 24 }, { unit: "CEL", cmdIdx: 14 }, { unit: "KIT", cmdIdx: 24 } ] },
  { name: 'Landing Bath', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 25 } ] },
  { name: 'Landing Bath', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 26 } ] },
  { name: 'Lounge', action: 'Bright', cmds: [ { unit: "PLC", cmdIdx: 27 }, { unit: "KIT", cmdIdx: 27 } ] },
  { name: 'Lounge', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 28 }, { unit: "KIT", cmdIdx: 28 } ] },
  { name: 'Master', action: 'Bright', cmds: [ { unit: "PLC", cmdIdx: 37 }, { unit: "PLC", cmdIdx: 30 } ] },
  { name: 'Master', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 32 }, { unit: "PLC", cmdIdx: 29 } ] },
  { name: 'Master', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 33 }, { unit: "PLC", cmdIdx: 31 } ] },
  { name: 'Office', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 7 }, { unit: "OFF", cmdIdx: 7 }, { unit: "KIT", cmdIdx: 7 } ] },
  { name: 'Office', action: 'Rob Area', cmds: [ { unit: "PLC", cmdIdx: 12 }, { unit: "OFF", cmdIdx: 9 }, { unit: "KIT", cmdIdx: 12 } ] },
  { name: 'Office', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 8 }, { unit: "OFF", cmdIdx: 8 }, { unit: "KIT", cmdIdx: 8 } ] },
  { name: 'Outside', action: 'On', cmds: [ { unit: "UT", cmdIdx: 1 }, { unit: "CEL", cmdIdx: 1 } ] },
  { name: 'Outside', action: 'Off', cmds: [ { unit: "UT", cmdIdx: 2 }, { unit: "CEL", cmdIdx: 2 } ] },
  { name: 'Spidey Bed', action: 'Bright', cmds: [ { unit: "UT", cmdIdx: 12 }, { unit: "UT", cmdIdx: 8 } ] },
  { name: 'Spidey Bed', action: 'Off', cmds: [ { unit: "UT", cmdIdx: 11 }, { unit: "UT", cmdIdx: 9 } ] },
  { name: 'Spidey Wall', action: 'On', cmds: [ { unit: "UT", cmdIdx: 13 } ] },
  { name: 'Spidey Wall', action: 'Off', cmds: [ { unit: "UT", cmdIdx: 14 } ] },
  { name: 'Tram Bed', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 34 } ] },
  { name: 'Tram Bed', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 35 } ] },
  { name: 'Guest', action: 'Mood', cmds: [ { unit: "PLC", cmdIdx: 17 }, { unit: "PLC", cmdIdx: 15 } ] },
  { name: 'Guest', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 16 }, { unit: "PLC", cmdIdx: 13 } ] },
  { name: 'Door Lock', action: 'Main', cmds: [ { unit: "FRONT", cmdStr: 'main-unlock' } ] },
  { name: 'Door Lock', action: 'Inner', cmds: [ { unit: "FRONT", cmdStr: 'inner-unlock' } ] }
]

// var winWidth = Dimensions.get('window').width - 20
// var squares = [1, 2, 3, 4, 5, 6, 7, 8]
// var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var SimpleHomeControl = React.createClass({
  _handlePress: function(scenesIdx, actionIdx) {
    var action = sceneList[scenesIdx].actions[actionIdx];
    for (var cmdsIdx = 0; cmdsIdx < action.cmds.length; cmdsIdx++) {
      var cmd = action.cmds[cmdsIdx];
      if (!(cmd.unit in domoticzUnits))
        continue;
      var ip = domoticzUnits[cmd.unit].ip4;
      var cmdUrl = "";
      if ('cmdIdx' in cmd) {
        var cmdIdx = cmd.cmdIdx;
        cmdUrl = 'http://' + ip + '/json.htm?type=command&param=switchscene&idx=' + cmdIdx + '&switchcmd=On';
      }
      else if ('cmdStr' in cmd) {
        cmdUrl = 'http://' + ip + '/' + cmd.cmdStr;
      }
      if (cmdUrl !== "") {
          console.log("Requesting " + cmdUrl);
          fetch(cmdUrl)
              .catch((error) => {
                  console.log("Error sending command " + error);
              });
      }
    }
  },

  // getInitialState: function(){
  //   return { dataSource: ds.cloneWithRows(squares) }
  // },
  
  // renderRow: function(rowData){
  //   return <View style={ styles.square }>
  //             <View style={ styles.s }></View>
  //             <Text>{ rowData }</Text>
  //           </View>
  // },
  
  // renderTHEY: function() {
  //
  //   return (
  //     <ListView
  //     contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', marginLeft:10, marginRight:10 }}
  //     dataSource={ this.state.dataSource }
  //     renderRow={ this.renderRow }
  //     />
  //   );
  // },

  render: function() {
    var renderThis = this;
    sceneList = [];
    var lastSceneName = null;
    var maxActionListLen = 0;
    var actionListLen = 0;
    for (var i = 0; i < scenes.length; i++){
      scene = scenes[i]
      if (lastSceneName === null || lastSceneName !== scene.name){
        sceneList.push({ name: scene.name, actions: [ { action: scene.action, cmds: scene.cmds }]});
        actionListLen = 1;
        if (maxActionListLen < actionListLen)
          maxActionListLen = actionListLen;
      }
      else
      {
        sceneList[sceneList.length-1].actions.push({ action: scene.action, cmds: scene.cmds });
        actionListLen++;
        if (maxActionListLen < actionListLen)
          maxActionListLen = actionListLen;
      }
      lastSceneName = scene.name;
    }
    var winWidth = Dimensions.get('window').width - 20;
    var leftColWidth = winWidth / 3;
    var buttonsTotalWidth = winWidth - leftColWidth;
    var buttonWidth = buttonsTotalWidth / 3 - 10;
    // Balance lengths of actions
    // for (var i = 0; i < sceneList.length; i++){
    //   for (var j = 0; j < maxActionListLen-sceneList[i].actions.length; j++)
    //     sceneList[i].actions.push({});
    // }
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center',
           backgroundColor: '#F5FCFF' }}>
        <Text style={{ fontSize: 30, textAlign: 'center', margin: 4, fontWeight: 'bold' }}>
          8 Dick Place
        </Text>

            <ScrollView contentContainerStyle={{flex: 1, flexDirection: 'column', 
                  justifyContent: 'flex-start' }}>
          {
            sceneList.map(function(scene, scenesIdx) {
              return(
                <View key={scenesIdx} style={{flexDirection: 'row', justifyContent: 'flex-start', 
                      paddingLeft: 12, paddingTop: 0, paddingBottom: 0,
                      borderWidth: 1, borderColor: "#ffffff",
                      alignItems:"flex-start", flexWrap: "nowrap" }}>
                  <Text style={{fontSize: 20, color: '#404040', width: leftColWidth,
                                fontWeight: 'bold'}}>
                      {scene.name}
                  </Text>
                  {
                    scene.actions.map(function(action, actionIdx) {
                      if ("action" in action){
                        return(
      // <ListView
      // contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', marginLeft:10, marginRight:10 }}
      // dataSource={ renderThis.state.dataSource }
      // renderRow={ renderThis.renderRow }
      // />
                          <View key={actionIdx}>
                            <Button
                              containerStyle={{margin: 2, padding:1, overflow:'hidden', borderRadius:3,
                                    backgroundColor: '#80F6FF', borderColor:'#606060', borderWidth:1}}
                              style={{width: buttonWidth, fontSize: 20, color: '#404040'}}
                              styleDisabled={{color: 'red'}}
                              onPress={() => renderThis._handlePress(scenesIdx, actionIdx)}>
                              {action.action}
                            </Button>
                          </View>
                        )
                      }
                    })
                  }
                </View>
              )
            })
          }
          </ScrollView>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  // square: {
  //   margin: 10,
  //   alignItems: 'center'
  // },
  // s: {
  //   backgroundColor: '#ededed',
  //   width: winWidth / 3 - 20,
  //   // height: winWidth / 5 - 20,
  //   flex:1,
  //   alignSelf: 'center'
  // }
});

AppRegistry.registerComponent('SimpleHomeControl', () => SimpleHomeControl);