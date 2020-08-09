import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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

import Logo from './Logo';
import Navigation from './Navigation';

const storageSpaces = [
  {
    category: {
      name: 'bike',
      description: 'open storage spaces'
    },
    name: 'bicycle/ebike',
    size: {
      width: 0.6,
      depth: 2,
      height: 1.1
    },
    price: {
      month: 20,
      quarter: 51,
      biannual: 81,
      annual: 120
    }
  },
  {
    category: {
      name: 'bike',
      description: 'open storage space'
    },
    name: 'enduro / small moto',
    size: {
      width: 1,
      depth: 2,
      height: 1.1
    },
    price: {
      month: 60,
      quarter: 150,
      biannual: 240,
      annual: 360
    }
  },
  {
    category: {
      name: 'bike',
      description: 'open storage space'
    },
    name: 'large motorcycle',
    size: {
      width: 1,
      depth: 2.5,
      height: 1.1
    },
    price: {
      month: 80,
      quarter: 200,
      biannual: 320,
      annual: 480
    }
  },
  {
    category: {
      name: 'baby bear',
      description: 'locker storage cupboard'
    },
    name: 'ski/board, boots',
    size: {
      width: 0.5,
      depth: 0.5,
      height: 2.3
    },
    price: {
      month: 30,
      quarter: 75,
      biannual: 120,
      annual: 180
    }
  },
  {
    category: {
      name: 'baby bear',
      description: 'locker storage cupboard'
    },
    name: 'luggage',
    size: {
      width: 1,
      depth: 1,
      height: 1.1
    },
    price: {
      month: 30,
      quarter: 75,
      biannual: 120,
      annual: 180
    }
  },
  {
    category: {
      name: 'mama bear',
      description: 'locker storage room'
    },
    name: 'small locker room',
    size: {
      width: 1,
      depth: 2.5,
      height: 2.3
    },
    price: {
      month: 100,
      quarter: 250,
      biannual: 400,
      annual: 600
    }
  },
  {
    category: {
      name: 'mama bear',
      description: 'locker storage room'
    },
    name: 'medium locker room',
    size: {
      width: 2,
      depth: 2.5,
      height: 2.3
    },
    price: {
      month: 200,
      quarter: 500,
      biannual: 800,
      annual: 1200
    }
  },
  {
    category: {
      name: 'papa bear',
      description: 'locker storage room'
    },
    name: 'large locker room',
    size: {
      width: 2.7,
      depth: 2.5,
      height: 2.3
    },
    price: {
      month: 240,
      quarter: 600,
      biannual: 960,
      annual: 1440
    }
  }
];
const storageCategories = storageSpaces.map(lg => lg.category).filter((o, i, s) => i === s.findIndex((t) => (t.name === o.name)));
const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
//const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];
const lockers = ['small', 'medium', 'large', 'bicycle', 'motorcycle', 'large-motorcycle'];
const client = Stitch.initializeDefaultAppClient('bearslairsstitch-pkblb');
const serviceClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
//const stripe = Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I0nfCqc5I');

class Book extends Component {
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
    let selectedCategoryIndex = Math.max(0, storageCategories.findIndex((c) => (c.name === window.location.hash.slice(1).replace('+', ' '))));
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
      selectedStorageSpace: null,
      selectedCategoryIndex: selectedCategoryIndex
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayReservations = this.displayReservations.bind(this);
    this.addReservation = this.addReservation.bind(this);
    this.lockerSelectHandler = this.lockerSelectHandler.bind(this);
    this.getDurationInMonths = this.getDurationInMonths.bind(this);
    this.getPriceBand = this.getPriceBand.bind(this);
    this.getTotalPrice = this.getTotalPrice.bind(this);
    this.getInstallments = this.getInstallments.bind(this);
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
      this.setState({stripe: window.Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I0nfCqc5I')});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        this.setState({stripe: window.Stripe('pk_test_kSrcl4f2BEKQTkQCIuDih41I0nfCqc5I')});
      });
    }
    /*
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
    */
    this.db = serviceClient.db('bearslairs-bansko');
    this.displayReservationsOnLoad();
  }

  displayReservations() {
    this.db
      .collection('reservations')
      .find({}, { limit: 10 })
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
    let selectedStorageSpace = storageSpaces.find(storageSpace => storageSpace.name === name);
    if (selectedStorageSpace) {
      this.setState(state => ({
        selectedStorageSpace: ((state.selectedStorageSpace) && (state.selectedStorageSpace.name === name)) ? null : selectedStorageSpace
      }));
    }
    //this.forceUpdate();
  }

  getDurationInMonths() {
    let fromDate = (new Date (this.state.reservation.from));
    let toDate = (new Date (this.state.reservation.to));
    let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months -= fromDate.getMonth();
    months += toDate.getMonth();
    return months <= 0 ? 0 : months;
  }

  getPriceBand() {
    let durationInMonths = this.getDurationInMonths();
    if (durationInMonths < 3) {
      return 'month';
    } else if (durationInMonths < 6) {
      return 'quarter';
    } else if (durationInMonths < 12) {
      return 'biannual';
    }
    return 'annual';
  }

  getTotalPrice() {
    let priceBand = this.getPriceBand();
    let monthlyPrice;
    switch (priceBand) {
      case 'month':
        monthlyPrice = this.state.selectedStorageSpace.price[this.getPriceBand()];
        break;
      case 'quarter':
        monthlyPrice = (this.state.selectedStorageSpace.price[this.getPriceBand()] / 3);
        break;
      case 'biannual':
        monthlyPrice = (this.state.selectedStorageSpace.price[this.getPriceBand()] / 6);
        break;
      default:
        monthlyPrice = (this.state.selectedStorageSpace.price[this.getPriceBand()] / 12);
        break;
    }
    let durationInMonths = this.getDurationInMonths(this.state.reservation.from, this.state.reservation.to);
    return (durationInMonths * monthlyPrice).toFixed(2);
  }

  getInstallments() {
    let durationInMonths = this.getDurationInMonths(this.state.reservation.from, this.state.reservation.to);
    return [...Array(durationInMonths).keys()].map(installmentIndex => ({
      date: (new Date((new Date(this.state.reservation.from)).setMonth((new Date(this.state.reservation.from)).getMonth() + installmentIndex))),
      amount: (
        (installmentIndex < 2)
          ? this.state.selectedStorageSpace.price.month.toFixed(2)
          : (installmentIndex === 2)
            ? (this.state.selectedStorageSpace.price.quarter - (this.state.selectedStorageSpace.price.month * 2)).toFixed(2)
            : (installmentIndex < 5)
              ? (this.state.selectedStorageSpace.price.quarter / 3).toFixed(2)
              : (installmentIndex === 5)
                ? (this.state.selectedStorageSpace.price.biannual - ((this.state.selectedStorageSpace.price.quarter / 3) * 5)).toFixed(2)
                : (installmentIndex < 12)
                  ? (this.state.selectedStorageSpace.price.biannual / 6).toFixed(2)
                  : (this.state.selectedStorageSpace.price.annual / 12).toFixed(2)
      )
    }));
  }

  render() {
    return (
      <>
        <Logo language={this.state.language} />
        <Navigation language={this.state.language} />
        <Container>
          <Tabs defaultActiveKey={storageCategories[this.state.selectedCategoryIndex].name}>
            {
              storageCategories.map(storageCategory => (
                <Tab key={storageCategory.name} eventKey={storageCategory.name} title={storageCategory.name + ' (' + storageCategory.description + ')'}>
                  <Row style={{ height: '300px' }}>
                    {
                      storageSpaces.filter(lg => lg.category.name === storageCategory.name).map((storageSpace, lgI) => (
                        <Col key={lgI}>
                          <LockerAnimation
                            geometry={storageSpace}
                            color={{ default: 0x300b0b, active: 0x7bb32c, hover: 'hotpink'}}
                            onClick={() => this.lockerSelectHandler(storageSpace.name)}
                            active={((this.state.selectedStorageSpace) && (this.state.selectedStorageSpace.name === storageSpace.name))} />
                        </Col>
                      ))
                    }
                  </Row>
                  <Row>
                    {
                      storageSpaces.filter(lg => lg.category.name === storageCategory.name).map((storageSpace, lgI) => (
                        <Col key={lgI} style={{ textAlign: 'center' }}>
                          <p style={{color: (((this.state.selectedStorageSpace) && (this.state.selectedStorageSpace.name === storageSpace.name)) ? 'hotpink' : '#300b0b')}}>
                            <strong>{storageSpace.name}</strong>
                            <br />
                            floor space (area in square metres): <strong>{Math.round(storageSpace.size.width * storageSpace.size.depth * 10) / 10} m<sup>2</sup></strong>
                            <br />
                            air space (volume in cubic metres): <strong>{Math.round(storageSpace.size.width * storageSpace.size.depth * storageSpace.size.height * 10) / 10} m<sup>3</sup></strong>
                            <br />
                            width: <strong>{Math.round(storageSpace.size.width * 100)} cm</strong>
                            <br />
                            depth: <strong>{Math.round(storageSpace.size.depth * 100)} cm</strong>
                            <br />
                            height: <strong>{Math.round(storageSpace.size.height * 100)} cm</strong>
                            <br />
                            <br />
                            <strong>pricing</strong>
                            <br />
                            1 - 2 months: <strong>bgn {storageSpace.price.month.toFixed(2)} lev</strong> per month,
                            <br />
                            3 - 5 months: <strong>bgn {(storageSpace.price.quarter / 3).toFixed(2)} lev</strong> per month,
                            <br />
                            6 - 11 months: <strong>bgn {(storageSpace.price.biannual / 6).toFixed(2)} lev</strong> per month,
                            <br />
                            12 or more months: <strong>bgn {(storageSpace.price.annual / 12).toFixed(2)} lev</strong> per month
                          </p>
                        </Col>
                      ))
                    }
                  </Row>
                </Tab>
              ))
            }
          </Tabs>
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
              <StripeProvider stripe={this.state.stripe}>
                <Elements>
                  <CheckoutForm />
                </Elements>
              </StripeProvider>
            </Form>
          </Row>
          <Row>
            What's going on?
          </Row>
          <Row>
            {
              (this.state.selectedStorageSpace)
                ? (
                    <>
                      <dl>
                        <dt>from</dt>
                        <dd>
                          {
                            new Intl.DateTimeFormat(
                              'en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                              }).format(new Date(this.state.reservation.from))
                          }
                        </dd>
                        <dt>to</dt>
                        <dd>
                          {
                            new Intl.DateTimeFormat(
                              'en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                              }).format(new Date(this.state.reservation.to))
                          }
                        </dd>
                        <dt>duration</dt>
                        <dd>
                          { this.getDurationInMonths() } month{(this.getDurationInMonths() > 1) ? 's' : ''}
                        </dd>
                      </dl>
                      <p>
                        the total price for a <strong>{
                          this.getDurationInMonths()
                        }</strong> month booking in a <strong>{
                          this.state.selectedStorageSpace.category.name
                        }/{
                          this.state.selectedStorageSpace.name
                        }</strong> between <strong>{
                          new Intl.DateTimeFormat(
                            'en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: '2-digit'
                            }).format(new Date(this.state.reservation.from))
                          }</strong> and <strong>{
                          new Intl.DateTimeFormat(
                            'en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: '2-digit'
                            }).format(new Date(this.state.reservation.to))
                          }</strong> is: <strong>bgn {
                            this.getTotalPrice()
                          } lev</strong>.
                      </p>
                      <p>
                        this will be billed in monthly installments, as follows:
                      </p>
                      <dl>
                        <dt>
                          {
                            this.getInstallments().map(installment => (
                              <>
                                <dt>
                                  {
                                    new Intl.DateTimeFormat(
                                      'en-GB', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit'
                                      }).format(installment.date)
                                  }:
                                </dt>
                                <dd>
                                  {installment.amount}
                                </dd>
                              </>
                            ))
                          }
                        </dt>
                      </dl>
                    </>
                  )
                : ('')
            }
          </Row>
          {
            /*
            (window.location.hostname === 'localhost') ?
            <Row>
              <pre>
                {JSON.stringify(this.state, null, 2)}
              </pre>
            </Row> : null
            */
          }
        </Container>
      </>
    );
  }
}

export default Book;
