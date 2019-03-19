import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import ABI from './WordsList.json';
import SearchInput from './components/SearchInput';
import AddInput from './components/AddInput';
import SnackBar from './components/SnackBarCustom';
import Table from './components/Table';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';

import { WORDS_LIST_ADDRESS } from './config';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 1,
    display: 'flex',
    alignItems: 'center',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class App extends Component {
  constructor(props){
    super(props)
    this.state = { counter: 0, word_list: [], wordinput: '', open: false, wordsearch: '', message: '', searchCollapse: false}
    this.loadData()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  async loadData(){
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    let contract = new web3.eth.Contract(ABI, WORDS_LIST_ADDRESS)
    let counter = await contract.methods.countWords().call()
    let accounts = await web3.eth.getAccounts()
    for(var i = 1; i <= counter; i++){
      const word = await contract.methods.words(i).call()
      this.setState({
        ...this.state,
        word_list: [...this.state.word_list, {string: word.word, date: word.date}]
      })
    }
    
    this.setState({...this.state,
      counter: counter,
      account: accounts[0],
      contract: contract
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false, searchCollapse: false });
  };


  async handleSubmit() {
    await this.state.contract.methods.createWord(this.state.wordinput).send({from: this.state.account, gas:3000000}).once('receipt', result => {
    if(result.events.WordCreated)
      this.setState({
        ...this.state,
        word_list: [...this.state.word_list, {string: result.events.WordCreated.returnValues.word, date: result.events.WordCreated.returnValues.date}],
        counter: parseInt(this.state.counter)+1,
        wordinput: '',
        message: 'Added successfully!',
        open: true
      })
    else
      this.setState({...this.state,
        open: true,
        message: 'Fail! :('
      })
    })
  }

  async handleSearch() {
    let wordinfo = await this.state.contract.methods.getByDate(this.state.wordsearch).call()
    this.setState({
      ...this.state,
      wordsearch: '',
      search: wordinfo,
      searchCollapse:true,
      open: true,
      message: wordinfo !== '0' ? 'Found!' : 'Not found!'
    })    
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={Number(16)}>
            <Grid item xs={12} style={{textAlign: 'center'}}>
              <Typography variant="h2" component="h2">Ethereum website</Typography>
            </Grid>
            <Grid item>
              <AddInput handleSubmit={this.handleSubmit} handleChange={this.handleChange} value={this.state.wordinput}/>
            </Grid>
            <Grid  item>
              <SearchInput handleChange={this.handleChange} handleSubmit={this.handleSearch} value={this.state.wordsearch}/>
              <Collapse in={this.state.searchCollapse}>
                <Grid item>
                  <Paper className={classes.paper} elevation={1}>
                    <Typography variant="subtitle2" component="span" style={{flex: 1}}>Timestamp: {this.state.search}</Typography>
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleClose}
                      style={{float: 'right'}}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              </Collapse>
            </Grid>
            <Grid container className={classes.demo} justify="center" spacing={Number(16)}>
              <Grid item xs={8} >
                <Table words={this.state.word_list} totalWords={this.state.counter} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <SnackBar handleClick={this.handleClick} handleClose={this.handleClose} open={this.state.open} message={this.state.message}/>
      </Grid>
        
    );
  }
}

export default withStyles(styles)(App);
