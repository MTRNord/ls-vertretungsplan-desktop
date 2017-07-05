// @flow
import React, { Component } from 'react';
import SunIcon from 'material-ui/svg-icons/image/wb-sunny';
import styles from './Stunde.scss';
import md from './material.indigo-pink.min.css';

export default class Stunde extends Component {
  getTitle() {
    return this.props.title;
  }

  getInfos() {
    return this.props.infos;
  }

  render() {
    return (
      <div className={styles.StundeContainer}>
        <div className={`${md['mdl-card']} ${md['mdl-shadow--2dp']} ${styles['mdl-card--horizontal']}`}>
          <div className={styles['mdl-card__media']}>
            <img src={`http://placehold.it/150x200/${this.props.color}/FFFFFF?text=+`} alt="img" />
          </div>
          <div className={styles['mdl-card__title']}>
            <h2 className={`${styles['mdl-card__title-text']} ${styles['StundeContainerText']}`}>{ this.getTitle() }</h2>
          </div>
          <div className={`${styles['mdl-card__supporting-text']} ${styles['StundeContainerText']}`}>
            { this.getInfos() }
          </div>
          <div className={`${md['mdl-card__menu']}`}>
            <SunIcon />
          </div>
        </div>
        <br />
      </div>
    );
  }
}

Stunde.propTypes = {
  title: React.PropTypes.string,
  info: React.PropTypes.string,
  color: React.PropTypes.string,
};

Stunde.defaultProps = {
  title: 'Keine Infos',
  infos: 'Es findet alles statt',
  color: '2196F3',
};
