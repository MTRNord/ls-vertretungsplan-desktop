// @flow
import React, { Component } from 'react';
import rp from 'request-promise';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Stunde from './Stunde';

const url = 'https://api.vertretungsplan.me/v2/substitutionschedules/Schleswig_Lornsenschule/schulervertretungsplan?client=desktop_marcel';

export default class StundenList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      day0: [],
      day1: []
    };
  }

  componentDidMount() {
    this.getVertretung = () => rp(url);
    this.getDay1();
    this.getDay2();
  }

  getDay1() {
    const vertretungsplan = this.getVertretung();
    this.setState({
      loading: true,
    });
    vertretungsplan.then((body) => {
      const json = JSON.parse(body);
      this.setState({
        loading: false,
        day0: json.days[0].substitutions
      });
    });
  };

  getDay2() {
    const vertretungsplan = this.getVertretung();
    this.setState({
      loading: true,
    });
    vertretungsplan.then((body) => {
      const json = JSON.parse(body);
      this.setState({
        loading: false,
        day1: json.days[1].substitutions
      });
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <h4>Tag 1</h4>
          {
            this.state.day0.map(function(day) {
              return (
                <Stunde key={"0_" + Math.random() + day.lesson+"_"+day.subject+"_"+day.type} title={day.lesson} infos={day.type+" "+day.subject} />
              );
            })
          }
          <h4>Tag 2</h4>
          {
            this.state.day1.map(function(day) {
              return (
                <Stunde key={"1_" + Math.random() + day.lesson+"_"+day.subject+"_"+day.type} title={day.lesson} infos={day.type+" "+day.subject} />
              );
            })
          }
        </div>
      </MuiThemeProvider>
    );
  }
}
