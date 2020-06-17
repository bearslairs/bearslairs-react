import React from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from './Nav';
import Cookies from 'universal-cookie';
import * as qs from 'query-string';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk';
import {
  Elements,
  StripeProvider
} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import LockerAnimation from './LockerAnimation';

const lockerGeometries = [
  {
    name: 'small',
    width: 1,
    depth: 2.5,
    height: 2.3
  },
  {
    name: 'medium',
    width: 2,
    depth: 2.5,
    height: 2.3
  },
  {
    name: 'large',
    width: 3,
    depth: 2.5,
    height: 2.3
  }
];
const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];
const lockers = ['small', 'medium', 'large', 'bicycle', 'motorcycle', 'large-motorcycle'];
const client = Stitch.initializeDefaultAppClient('bearslairsstitch-pkblb');
const serviceClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
//const stripe = Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I000nfCqc5I');

class Book extends React.Component {
  constructor(props, context) {
    super(props, context);
    let language = languages.includes(querystring.lang) // if the querystring lang is set, use that
      ? querystring.lang
      : languages.includes(cookies.get('lang')) // else if the cookies contain a lang, use that
        ? cookies.get('lang')
        : 'en';
    let locker = lockers.includes(querystring.locker) // if the querystring lang is set, use that
      ? querystring.locker
      : 'small';
    // todo: handle timezone
    let startDate = new Date();
    startDate.setHours(14,0,0,0);
    startDate.setDate(startDate.getDate() + 1);
    let endDate = new Date();
    endDate.setHours(12,0,0,0);
    endDate.setMonth(startDate.getMonth() + 3);
    this.state = {
      stripe: null,
      reservations: [],
      language: language,
      reservation: {
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        name: '',
        email: '',
        telephone: '',
        locker: locker,
        language: language
      },
      copy: {
        languages: []
      },
      lockerGeometrySelection: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayReservations = this.displayReservations.bind(this);
    this.addReservation = this.addReservation.bind(this);
    this.lockerSelectHandler = this.lockerSelectHandler.bind(this);
  }
  handleChange(event) {
    const target = event.target;
    this.setState(state => {
      state.reservation[target.id] = target.value;
      return state;
    });
  }
  componentDidMount() {
    if (window.Stripe) {
      this.setState({stripe: window.Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I000nfCqc5I')});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        this.setState({stripe: window.Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I000nfCqc5I')});
      });
    }
    fetch(CopyApi + '/' + this.state.language + '/book.json')
      .then(responseCopyApi => responseCopyApi.json())
      .then((copy) => {
        this.setState(state => ({
          language: state.language,
          reservation: state.reservation,
          copy: copy
        }));
      })
      .catch(console.log);
    this.db = serviceClient.db('bearslairs-bansko');
    this.displayReservationsOnLoad();
  }

  displayReservations() {
    this.db
      .collection('reservations')
      .find({}, { limit: 1000 })
      .asArray()
      .then(reservations => { this.setState({reservations}); });
  }

  displayReservationsOnLoad() {
    client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayReservations)
      .catch(console.error);
  }

  addReservation(event) {
    event.preventDefault();
    const { reservation } = this.state;
    this.db
      .collection('reservations')
      .insertOne({
        owner_id: client.auth.user.id,
        reservation: reservation
      })
      .then(this.displayReservations)
      .catch(console.error);
  }

  lockerSelectHandler(name) {
    this.setState(state => ({
      lockerGeometrySelection: (state.lockerGeometrySelection === name) ? null : name
    }));
    //this.forceUpdate();
  }

  render() {
    return (
      <Container>
        <Row style={{ height: '300px' }}>
          {
            lockerGeometries.map((lockerGeometry, lgI) => (
              <Col key={lgI}>
                <LockerAnimation geometry={lockerGeometry} color={{ default: 0x300b0b, active: 0x7bb32c, hover: 'hotpink'}} onClick={() => this.lockerSelectHandler(lockerGeometry.name)} active={(this.state.lockerGeometrySelection === lockerGeometry.name)} />
              </Col>
            ))
          }
        </Row>
        <Row>
          {
            lockerGeometries.map((lockerGeometry, lgI) => (
              <Col key={lgI} style={{ textAlign: 'center' }}>
                <p style={{color: ((this.state.lockerGeometrySelection === lockerGeometry.name) ? 'hotpink' : '#300b0b')}}>
                  <strong>{lockerGeometry.name}</strong>
                  <br />
                  floor space (area in square metres): {Math.round(lockerGeometry.width * lockerGeometry.depth * 10) / 10} m<sup>2</sup>
                  <br />
                  air space (volume in cubic metres): {Math.round(lockerGeometry.width * lockerGeometry.depth * lockerGeometry.height * 10) / 10} m<sup>3</sup>
                  <br />
                  width: {Math.round(lockerGeometry.width * 100)} cm, height: {Math.round(lockerGeometry.height * 100)} cm, depth: {Math.round(lockerGeometry.depth * 100)} cm
                </p>
              </Col>
            ))
          }
        </Row>
        <Nav />
        <Row style={{ paddingTop: '10px' }}>
          <h2>make a reservation</h2>
        </Row>
        <Row style={{ paddingTop: '10px' }}>

          <Form onSubmit={this.addReservation}>
            <Form.Group controlId="name">
              <Form.Label>name</Form.Label>
              <Form.Control
                type="text"
                placeholder="full name"
                value={this.state.reservation.name}
                onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control
                type="email"
                placeholder="email"
                value={this.state.reservation.email}
                onChange={this.handleChange} />
              <Form.Text className="text-muted">
                we'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="telephone">
              <Form.Label>telephone</Form.Label>
              <Form.Control
                type="text"
                placeholder="telephone number"
                value={this.state.reservation.telephone}
                onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId="fromto">
              <Form.Label>reservation dates</Form.Label>
              <br />
              <DateRangePicker
                startDate={moment(this.state.reservation.from)}
                startDateId='reservation_from'
                endDate={moment(this.state.reservation.to)}
                endDateId='reservation_to'
                onDatesChange={({ startDate, endDate }) => this.setState(state => { state.reservation.from = startDate.toISOString(); state.reservation.to = endDate.toISOString(); return state; })}
                focusedInput={this.state.focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
            </Form.Group>
            <Form.Group controlId="locker">
              <Form.Label>i would like to book storage</Form.Label>
              <Form.Check
                type="radio"
                label="in a small locker"
                onChange={() => this.setState(state => {state.reservation.locker = 'small'; return state;})}
                checked={this.state.reservation.locker === 'small'} />
              <Form.Check
                type="radio"
                label="in a medium locker"
                onChange={() => this.setState(state => {state.reservation.locker = 'medium'; return state;})}
                checked={this.state.reservation.locker === 'medium'} />
              <Form.Check
                type="radio"
                label="in a large locker"
                onChange={() => this.setState(state => {state.reservation.locker = 'large'; return state;})}
                checked={this.state.reservation.locker === 'large'} />
              <Form.Check
                type="radio"
                label="for a bicycle"
                onChange={() => this.setState(state => {state.reservation.locker = 'bicycle'; return state;})}
                checked={this.state.reservation.locker === 'bicycle'} />
              <Form.Check
                type="radio"
                label="for a motorcycle"
                onChange={() => this.setState(state => {state.reservation.locker = 'motorcycle'; return state;})}
                checked={this.state.reservation.locker === 'motorcycle'} />
              <Form.Check
                type="radio"
                label="for a large motorcycle"
                onChange={() => this.setState(state => {state.reservation.locker = 'large-motorcycle'; return state;})}
                checked={this.state.reservation.locker === 'large-motorcycle'} />
            </Form.Group>
            <StripeProvider stripe={this.state.stripe}>
              <Elements>
                <CheckoutForm />
              </Elements>
            </StripeProvider>
          </Form>
        </Row>
        {
          (window.location.hostname === 'localhost') ?
          <Row>
            <pre>
              {JSON.stringify(this.state, null, 2)}
            </pre>
          </Row> : null
        }
      </Container>
    );
  }
}
export default Book;