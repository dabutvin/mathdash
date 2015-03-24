// Polling interval in seconds
var POLL_INTERVAL = 2;

function filterRecordsForDifficulty(str) {
    return function(record) {
        return record.difficulty === str;
    };
}

var RecordTable = React.createClass({
    render: function() {
        return (
            <div className="column medium-4">
                <h3>{this.props.label}</h3>
                <table>
                    <tr>
                        <th>Score</th>
                        <th>Level</th>
                        <th>Name</th>
                    </tr>
                    {this.props.records.map(function(record) {
                        return (
                            <tr>
                                <td>{record.score}</td>
                                <td>{record.level}</td>
                                <td>{record.name}</td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
});

var NameThisBetter = React.createClass({
    render: function() {
        var records = this.props.records,
            easyRecords = records.filter(filterRecordsForDifficulty("easy"))
                .splice(0, this.props.maxRecords),
            mediumRecords = records.filter(filterRecordsForDifficulty("medium"))
                .splice(0, this.props.maxRecords),
            hardRecords = records.filter(filterRecordsForDifficulty("hard"))
                .splice(0, this.props.maxRecords);

        return (
            <div>
                <RecordTable label="Easy" records={easyRecords} />
                <RecordTable label="Medium" records={mediumRecords} />
                <RecordTable label="Hard" records={hardRecords} />
            </div>
        );
  }
});


setInterval(function() {
    $.getJSON('/records/')
        .done(function(data) {
            React.render(
              <NameThisBetter data={data} maxRecords={10}  />,
              document.getElementById('highscore-tables')
            );
        })
        .error(function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        });
}, POLL_INTERVAL * 1000);
