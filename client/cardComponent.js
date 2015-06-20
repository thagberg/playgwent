define(['react'], function(React) {
    var Card = React.createClass({displayName: "Card",
        render: function() {
            return (
                React.createElement("div", {id: this.props.playerId + '-' + this.props.cardId, className: "card"}, 
                    React.createElement("div", null, this.props.title), 
                    React.createElement("div", null, "Faction: ", this.props.faction), 
                    React.createElement("div", null, "Value: ", this.props.value), 
                    React.createElement("div", null, "Type: ", this.props.type), 
                    React.createElement("div", null, "Hero: ", this.props.hero), 
                    React.createElement("div", null, "Spy: ", this.props.spy), 
                    React.createElement("div", null, this.props.text)
                )
            );
        }
    });

    return Card;
});
