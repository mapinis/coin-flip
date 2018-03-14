/*class Button extends Component {
  constructor(props){
    super(props);
    this.state = {clicked: false};
  }

  click(e) {
    this.setState(s => ({clicked: !s.clicked}))
  }

  render() {
    return (
      <button onClick = {this.click.bind(this)} className={this.state.clicked ? "clicked": "unclicked"}>
        {this.state.clicked ? this.props.clickedText : this.props.buttonText}
      </button>
    );
  }

}*/

/*<Button buttonText="ready" clickedText="waiting..." />
        <Button buttonText="click me" clickedText="clicked" />*/
