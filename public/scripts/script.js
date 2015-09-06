var RecordTables = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadRecordsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadRecordsFromServer();
        setInterval(this.loadRecordsFromServer, this.props.pollInterval);
    },
    render: function() {
        var recordRowsEasy = [],
            recordRowsMedium = [],
            recordRowsHard = [],
            stateData = this.state.data;

        for (var i = 0; i < stateData.length; i++) {
            if (stateData[i].difficulty.toLowerCase() === "easy" && recordRowsEasy.length < this.props.maxRecords) {
                recordRowsEasy.push(
                    <tr>
                        <td>{stateData[i].score}</td>
                        <td>{stateData[i].level}</td>
                        <td>{stateData[i].name}</td>
                    </tr>
                );
            } else if (stateData[i].difficulty.toLowerCase() === "normal" && recordRowsMedium.length < this.props.maxRecords) {
                recordRowsMedium.push(
                    <tr>
                        <td>{stateData[i].score}</td>
                        <td>{stateData[i].level}</td>
                        <td>{stateData[i].name}</td>
                    </tr>
                );
            } else if (stateData[i].difficulty.toLowerCase() === "brutal" && recordRowsHard.length < this.props.maxRecords) {
                recordRowsHard.push(
                    <tr>
                        <td>{stateData[i].score}</td>
                        <td>{stateData[i].level}</td>
                        <td>{stateData[i].name}</td>
                    </tr>
                );
            }
        }

        return (
            <div>
                <div className="column medium-4">
                    <h3>Easy</h3>
                    <table>
                        <tr>
                            <th>Score</th>
                            <th>Level</th>
                            <th>Name</th>
                        </tr>
                        {recordRowsEasy}
                    </table>
                </div>
                <div className="column medium-4">
                    <h3>Normal</h3>
                    <table>
                        <tr>
                            <th>Score</th>
                            <th>Level</th>
                            <th>Name</th>
                        </tr>
                        {recordRowsMedium}
                    </table>
                </div>
                <div className="column medium-4">
                    <h3>Brutal</h3>
                    <table>
                        <tr>
                            <th>Score</th>
                            <th>Level</th>
                            <th>Name</th>
                        </tr>
                        {recordRowsHard}
                    </table>
                </div>
            </div>
        );
  }
});

React.render(
  <RecordTables url="/records/" pollInterval={2000000} maxRecords={10}  />,
  document.getElementById('highscore-tables')
);