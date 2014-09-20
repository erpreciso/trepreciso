# coding: utf-8
# trepreciso webapp

import webapp2
import contacts
import home
import bouncingball
import movebrick
import distancespider

class JollyHandler(webapp2.RequestHandler):
    def get(self, jolly):
        self.redirect("/home")
       
PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication([
    ("/contacts", contacts.ContactsHandler),
    ("/home", home.HomeHandler),
    ("/bouncingball", bouncingball.BouncingBallHandler),
    ("/movebrick", movebrick.MovebrickHandler),
    ("/distancespider", distancespider.DistanceSpiderHandler),
    (PAGE_RE, JollyHandler),
            ])
