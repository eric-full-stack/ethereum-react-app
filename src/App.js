import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SearchInput from './components/SearchInput';
import AddInput from './components/AddInput';
import SnackBar from './components/SnackBarCustom';
import Table from './components/Table';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'typeface-roboto';

import { API_URL } from './config';

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
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class App extends Component {
  constructor(props){
    super(props)
    this.state = { counter: 0, word_list: [], wordinput: '', open: false, wordsearch: '', message: '', searchCollapse: false, loading: true}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }
  componentDidMount(){
    this.loadData()
  }
  async loadData(){
    this.setState({ loading: true })
    let counter = await axios.get(API_URL+'counter')
    let account = await axios.get(API_URL+'account')
    let words = await axios.get(API_URL+'words')
    
    this.setState({
      ...this.state,
      word_list: words.data,
      counter: counter.data,
      account: account.data,
    })    
    this.setState({ loading: false })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleClick = () => {
    this.setState({ open: true });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false, searchCollapse: false });
  }


  async handleSubmit() {
    this.setState({ loading: true })
    await axios.post(API_URL+'word', {word: this.state.wordinput}).then( res => {
      this.setState({
        ...this.state,
        wordinput: '',
        message: res.data.success ? 'Added successfully!' : 'Fail! :(',
        open: true
      })
      if(res.data.success){
        this.loadData()
      }
      this.setState({ loading: false })
    })

  }

  async handleSearch() {
    await axios.get(API_URL+'word', {params: { word: this.state.wordsearch} }).then(res => {
      this.setState({
        ...this.state,
        wordsearch: '',
        search: res.data,
        searchCollapse:true,
        open: true,
        message: res.data !== '0' ? 'Found!' : 'Not found!'
      })    
    })
    
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="center" spacing={Number(16)}>
            <Grid item xs={12} style={{textAlign: 'center'}}>
              <Typography variant="h2" component="h2">Ethereum Challenge</Typography>
              <Typography variant="caption" component="h5">by Eric Prates</Typography>
            </Grid>
            {this.state.loading ? <CircularProgress className={classes.progress} /> : 
              <Grid container justify="center" spacing={Number(16)}>
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
            }
          </Grid>
        </Grid>
        <SnackBar handleClick={this.handleClick} handleClose={this.handleClose} open={this.state.open} message={this.state.message}/>
      </Grid>

      );
  }
}

export default withStyles(styles)(App);
