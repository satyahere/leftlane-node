const db = require('./dbconfig');

exports.createData = (req, res, next) => {
  const {userid} = req.headers;

  if(!userid) return res.status(400).json({
      error : new Error('Invalid Headers')
  });

  const addressInfo = req.body ;
    const jsonData = {
        "address1": addressInfo.address1,
        "address2": addressInfo.address2,
        "city": addressInfo.city,
        "statename": addressInfo.state,
        "zipcode": addressInfo.zipcode,
        "datecreated": addressInfo.datecreated,
        "usercreated": addressInfo.usercreated,
        "datemodified": addressInfo.datemodified,
        "usermodified": addressInfo.usermodified,
        "cognito_username" : userid,
     };

    let stmt = `INSERT INTO addressInformation
    (cognito_username,address1,address2,city,state,zipcode,datecreated,usercreated,datemodified,usermodified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
    db.query(stmt, [jsonData.cognito_username,jsonData.address1,jsonData.address2,
        jsonData.city,jsonData.state,jsonData.zipcode,jsonData.datecreated,jsonData.usercreated,
        jsonData.datemodified,jsonData.usermodified], (err, results, fields) => {
        if (err) {
            var error = new Error("Due to error unable to insert data");
            return res.status(500).json({
                error
            })
        }
        res.status(200).json({
            message : 'data inserted successfully'
        });
    });
};
