module.exports = {
	'dbUrl' : 'mongodb://username:password@link:port/db',
	'secret' : 'thebigsecret',
	'facebookAuth' : {
        'clientID'      : 'appID',
        'clientSecret'  : 'appSecret',
        'callbackURL'     : 'http://localhost:5000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : 'clientId',
        'clientSecret'     : 'clientSecret',
        'callbackURL'      : 'http://localhost:5000/auth/google/callback'
    }

}