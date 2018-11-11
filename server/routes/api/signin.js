const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  //   app.get('/api/counters', (req, res, next) => {
  //     Counter.find()
  //       .exec()
  //       .then((counter) => res.json(counter))
  //       .catch((err) => next(err));
  //   });
  //
  //   app.post('/api/counters', function (req, res, next) {
  //     const counter = new Counter();
  //
  //     counter.save()
  //       .then(() => res.json(counter))
  //       .catch((err) => next(err));
  //   });

  app.post('/api/account/signin', (req, res, next) => {
    const {
      body
    } = req;
    const {
      password
    } = body;

    let {
      email
    } = body;

    if (!email) {
      res.send({
        succes: false,
        message: ' Error: Email cannot be blank.'
      })
    };
    if (!password) {
      res.send({
        succes: false,
        message: 'Error: Password cannot be blank.'
      })
    };
    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: invalid'
        })
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        })
      }

      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.send({
          success: true,
          message: 'valid signin',
          token: doc._id
        })
      })
    })
  })

  app.get('/api/account/verify', (req, res, next) => {
    //get the token
    //verify token that its unique
    // and that its not deleted
    const {
      query
    } = req;
    const {
      token
    } = query;

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {

      if (err) {
        return res.send({
          success: false,
          message: 'error: server error'
        });
      }

      if (sessions.length < 1) {
        return res.send({
          success: false,
          message: 'error: Invalid'
        })
      } else {
        return res.send({
          success: true,
          message: 'good'
        })
      }
    })
  })

  app.post('/api/account/signup', (req, res, next) => {
    console.log(req.body, 'body');
    const {
      body
    } = req;
    const {
      firstName,
      lastName,
      password
    } = body;

    let {
      email
    } = body;

    if (!firstName) {
      console.log(1);
      res.send({
        succes: false,
        message: 'Error: First name cannot be blank.'
      })
    };

    if (!lastName) {
      console.log(2);
      res.send({
        succes: false,
        message: 'Error: Last name cannot be blank.'
      })
    };

    if (!password) {
      console.log(3);
      res.send({
        succes: false,
        message: 'Error: Password cannot be blank.'
      })
    };

    if (!email) {
      console.log(4);
      res.send({
        succes: false,
        message: ' Error: Email cannot be blank.'
      })
    };

    email = email.toLowerCase();

    //steps:
    //verify email doesnt exist
    //save

    User.find({
      email: email
    }, (err, previousUsers) => {
      console.log(previousUsers);
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server Error'
        })
      }
      if (previousUsers.length > 0) {
        res.send({
          success: false,
          message: 'Error: Account already exists'
        })
      } else {
        //save new user

        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            res.send({
              success: false,
              message: 'Error: server error'
            })
          }
          res.send({
            success: true,
            message: 'Signed up'
          })
        })
      }
    })
  })

  app.get('/api/account/logout', (req, res, next) => {

    //get the token
    //verify token that its unique
    // and that its not deleted
    const {
      query
    } = req;
    const {
      token
    } = query;

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, sessions) => {

      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'error: server error'
        });
      }

        return res.send({
          success: true,
          message: 'good'
        })
    })
  })
}
