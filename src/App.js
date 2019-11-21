import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import './App.css';
import Cookies from 'universal-cookie';
import Nav from './Nav';
import * as qs from 'query-string';

const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];

class App extends Component {
  state = {
    language: 'en',
    copy: {
      carousel: [],
      blurbs: [],
      cards: []
    }
  };

  componentDidMount() {
    let language = languages.includes(querystring.lang) // if the querystring lang is set, use that
      ? querystring.lang
      : languages.includes(cookies.get('lang')) // else if the cookies contain a lang, use that
        ? cookies.get('lang')
        : this.state.language; // fall back to a default
    this.setState(prevState => ({ 
      language: language,
      copy: prevState.copy
    }));
    cookies.set('lang', language, { path: '/' });
    fetch(CopyApi + '/' + language + '/home.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(prevState => ({
        language: prevState.language,
        copy: copy
      }));
    })
    .catch(console.log);
  }
  render() {
    return (
      <Container>
        <Nav />
        <Row style={{ paddingTop: '10px' }}>
          <Carousel>
            {
              this.state.copy.carousel.map((carouselItem, carouselItemIndex) => (
                <Carousel.Item key={carouselItemIndex}>
                  <Image src={carouselItem.image.url} alt={carouselItem.image.alt} rounded="true" />
                  <Carousel.Caption>
                    <h3>{carouselItem.title}</h3>
                    <p>{carouselItem.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            }
          </Carousel>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.blurbs.slice(0, 2).map((blurb, blurbIndex) => (
              <div key={blurbIndex}>
                <h4>{blurb.title}</h4>
                {
                  blurb.copy.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))
                }
              </div>
            ))
          }
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.cards.slice(0, 3).map((card, cardIndex) => (
              <Card style={{ width: '30%', marginRight: '10px' }} key={cardIndex}>
                <Card.Header as="h3">
                  {card.title}
                  <Image src={card.icon.url} alt={card.icon.alt} rounded="true" style={{ marginRight: '10px' }} className="float-right" />
                </Card.Header>
                <Card.Img variant="top" src={card.image.url} alt={card.image.alt} rounded="true" />
                <Card.Body>
                  <Card.Title>
                    {card.description.join(' ')}
                  </Card.Title>
                  <hr />

                  <ul>
                    {
                      card.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>
                          {feature.text}
                          <ul>
                            {
                              feature.details.map((detail, detailIndex) => (
                                <li key={detailIndex}>
                                  {detail}
                                </li>
                              ))
                            }
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                  <LinkContainer to={card.button.link}>
                    <Button variant="primary" className="float-right">
                      {card.button.text}
                    </Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            ))
          }
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.blurbs.slice(2, 4).map((blurb, blurbIndex) => (
              <div key={blurbIndex}>
                <h4>{blurb.title}</h4>
                {
                  blurb.copy.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>
                      {paragraph}
                    </p>
                  ))
                }
              </div>
            ))
          }
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.cards.slice(3, 6).map((card, cardIndex) => (
              <Card style={{ width: '30%', marginRight: '10px' }} key={cardIndex}>
                <Card.Header as="h3">
                  {card.title}
                  <Image src={card.icon.url} alt={card.icon.alt} rounded="true" style={{ marginRight: '10px' }} className="float-right" />
                </Card.Header>
                <Card.Img variant="top" src={card.image.url} alt={card.image.alt} rounded="true" />
                <Card.Body>
                  <Card.Title>
                    {card.description.join(' ')}
                  </Card.Title>
                  <hr />
                  <ul>
                    {
                      card.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>
                          {feature.text}
                          <ul>
                            {
                              feature.details.map((detail, detailIndex) => (
                                <li key={detailIndex}>
                                  {detail}
                                </li>
                              ))
                            }
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                  <LinkContainer to={card.button.link}>
                    <Button variant="primary" className="float-right">
                      {card.button.text}
                    </Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            ))
          }
        </Row>
        <footer className="clearfix" style={{ marginTop: '20px' }}>
          <p className="text-center text-muted">
            <a href={'https://github.com/bearslairs/bearslairs-data/edit/master/copy/' + this.state.language + '/home.json'}>
              edit this page
            </a>
          </p>
        </footer>
      </Container>
    );
  }
}

export default App;
