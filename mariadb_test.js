const mariadb = require('mariadb');
mariadb.createConnection({
      host: 'localhost', 
      user:'root',
      password: 'abcd1234'
    })
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.end();
    })
    .catch(err => {
      console.log("not connected due to error: " + err);
    });


    var sql = `INSERT INTO deals 
    ( 
      dealNo, 
      oppName, 
      oppValue, 
      oppClosedate, 
      custName, 
      custAdd, 
      custState, 
      custCountry, 
      custEmployee, 
      custVM, 
      custApps, 
      custBudget, 
      closeDate, 
      submitterReseller, 
      submitterName, 
      submitterDesignation, 
      submitterPhone, 
      submitterEmail, 
      submitterActivity, 
      dealRegStatus, 
      dealRegSubmitdate ) 
      VALUES ( 
        '${dealNo}', 
        '${oppName}', 
        '${oppValue}', 
        '${oppClosedate}', 
        '${custName}', 
        '${custAdd}', 
        '${custState}', 
        '${custCountry}', 
        '${custEmployee}', 
        '${custVM}', 
        '${custApps}', 
        '${custBudget}', 
        '${closeDate}',  
        '${submitterReseller}', 
        '${submitterName}', 
        '${submitterDesignation}', 
        '${submitterPhone}', 
        '${submitterEmail}', 
        '${submitterActivity}', 
        'pending', 
        ${date}' )`;
