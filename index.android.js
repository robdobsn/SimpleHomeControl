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
  ScrollView
} from 'react-native';

var domoticzUnits = {
   "UT": { name: "Office", ip4: "192.168.0.232" },
   "PLC": { name: "Office", ip4: "192.168.0.233" },
   "CEL": { name: "Office", ip4: "192.168.0.234" },
   "OFF": { name: "Office", ip4: "192.168.0.235" },
   "KIT": { name: "Office", ip4: "192.168.0.236" }
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
  { name: 'Guest', action: 'Off', cmds: [ { unit: "PLC", cmdIdx: 16 }, { unit: "PLC", cmdIdx: 13 } ] }
]
var SimpleHomeControl = React.createClass({
  _handlePress: function(scenesIdx, actionIdx) {
    var action = sceneList[scenesIdx].actions[actionIdx];
    for (var cmdsIdx = 0; cmdsIdx < action.cmds.length; cmdsIdx++) {
      var cmd = action.cmds[cmdsIdx]
      if (!(cmd.unit in domoticzUnits))
        continue;
      var ip = domoticzUnits[cmd.unit].ip4;
      var cmdIdx = cmd.cmdIdx;
      var cmdUrl = 'http://' + ip + '/json.htm?type=command&param=switchscene&idx=' + cmdIdx + '&switchcmd=On'
      console.log("Requesting " + cmdUrl)
      fetch(cmdUrl)
        .catch((error) => {
          console.log("Error sending command " + error);
        });
    }
  },
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
    // Balance lengths of actions
    // for (var i = 0; i < sceneList.length; i++){
    //   for (var j = 0; j < maxActionListLen-sceneList[i].actions.length; j++)
    //     sceneList[i].actions.push({});
    // }
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center',
           backgroundColor: '#F5FCFF' }}>
        <Text style={{ fontSize: 30, textAlign: 'center', margin: 10 }}>
          8 Dick Place
        </Text>

            <ScrollView contentContainerStyle={{flex: 1, flexDirection: 'column', 
                  justifyContent: 'flex-start' }}>
          {
            sceneList.map(function(scene, scenesIdx) {
              return(
                <View key={scenesIdx} style={{flexDirection: 'row', justifyContent: 'flex-start', 
                      paddingLeft: 12, paddingTop: 6, paddingBottom: 6,
                      backgroundColor: 'skyblue', borderWidth: 1, borderColor: "lightgray", 
                      alignItems:"flex-start", flexWrap: "nowrap" }}>
                  <Text style={{fontSize: 20, color: 'black', alignSelf: "auto", minWidth: 140 }}>{scene.name}</Text>
                  {
                    scene.actions.map(function(action, actionIdx) {
                      if ("action" in action){
                        return(
                          <View key={actionIdx} style={{paddingRight:18, minWidth: 20}}>
                            <Button
                              style={{fontSize: 20, color: 'blue', textDecorationLine: "underline"}}
                              styleDisabled={{color: 'red'}}
                              onPress={() => renderThis._handlePress(scenesIdx, actionIdx)}>
                              {action.action}
                            </Button>
                          </View>
                        )
                      }
                      else
                      {
                        return(
                          <View key={actionIdx} style={{padding:5, backgroundColor:'green', minWidth: 20}}/>
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
});

AppRegistry.registerComponent('SimpleHomeControl', () => SimpleHomeControl);

