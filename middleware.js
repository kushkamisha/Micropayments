const logger = require('./logger')
const crypto = require('./utils/crypto')
const { verifyToken } = require('./utils/crypto')

const verifyAppToken = (req, res, next) => {
    const token = req.body.token
    crypto.verifyToken(token)
        .then(decoded => {
            req.body.decoded = decoded
            next()
        })
        .catch(err => {
            logger.debug({ err })
            res.status(401).send({
                status: 'unauthorized',
                message: 'Invalid token provided'
            })
        })
}

const verifySocketToken = (socket, next) => {
    const token = socket.handshake.query.token
    verifyToken(token)
        .then(({ userId }) => {
            console.log({ userId })
            next()
        })
        .catch(() =>
            logger.error('Invalid token is provided via a socket connetion'))
}

module.exports = {
    verifyAppToken,
    verifySocketToken,
}
