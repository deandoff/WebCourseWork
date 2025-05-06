const e = require('express')
const Errors = require('../error/errors')
const {User} = require('../models/models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();

const generateJWT = (id, username, role) => {
    return jwt.sign({id, username, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async loginPage(req, res) {
        res.render('login', { error: null });
      }
    
      async login(req, res, next) {
        console.log('[LOGIN] Start');
      
        try {
          console.log('[LOGIN] Body:', req.body);
      
          const { username, password } = req.body;
          if (!username || !password) {
            console.log('[LOGIN] Missing credentials');
            return next(Errors.internal('Missing credentials'));
          }
      
          const user = await User.findOne({ where: { username } });
          console.log('[LOGIN] User:', user);
      
          if (!user) {
            console.log('[LOGIN] User not found');
            return next(Errors.internal('User not found'));
          }
      
          const isValidPassword = bcrypt.compareSync(password, user.password);
          console.log('[LOGIN] Password valid:', isValidPassword);
      
          if (!isValidPassword) {
            return next(Errors.internal('Wrong password'));
          }
      
          const token = generateJWT(user.id, user.username, user.role);
          console.log('[LOGIN] Token generated');
      
          res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          });
      
          console.log('[LOGIN] Cookie set, responding');
          return res.redirect('/home');
        } catch (error) {
          console.error('[LOGIN ERROR]', error);
          return next(Errors.internal('Login failed'));
        }
      }
      
    
      async logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/login');
      }
    
      async home(req, res) {
        const token = req.cookies.token;
        if (!token) return res.redirect('/login');
    
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          res.render('home', {
            username: decoded.username,
            role: decoded.role,
          });
        } catch (err) {
          return res.redirect('/login');
        }
      }
    
    async check(req, res) {
        const token = generateJWT(req.user.id, req.user.username, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()