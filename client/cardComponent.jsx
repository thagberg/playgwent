define(['react'], function(React) {
    var Card = React.createClass({
        render: function() {
            return (
                <div id={this.props.playerId + '-' + this.props.cardId} className="card">
                    <div>{this.props.title}</div>
                    <div>Faction: {this.props.faction}</div>
                    <div>Value: {this.props.value}</div>
                    <div>Type: {this.props.type}</div>
                    <div>Hero: {this.props.hero}</div>
                    <div>Spy: {this.props.spy}</div>
                    <div>{this.props.text}</div>
                </div>
            );
        }
    });

    return Card;
});