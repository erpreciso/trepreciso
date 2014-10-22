# coding: utf-8
# trepreciso webapp

import os
import webapp2
import jinja2
import logging

class MainHandler(webapp2.RequestHandler):
    template_dir = os.path.join(os.path.dirname(__file__), 'pages')
    jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(
        template_dir),
        autoescape = True)

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    
    def read(self,param):
        return self.request.get(param)
        
    def renderStr(self, template, **params):
        return self.jinja_env.get_template(template).render(params)
        
    def renderPage(self, template, **kw):
        self.write(self.renderStr(template, **kw))

class JollyHandler(webapp2.RequestHandler):
    def get(self, jolly):
        self.redirect("/home")

class PageHandler(MainHandler):     
    def get(self, action):
        return self.renderPage("index.html",
		page=action,
		dev_workflow_status=os.environ["DEV_WORKFLOW_STATUS"])

PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication([
    webapp2.Route(r"/<action>", handler=PageHandler),
    (PAGE_RE, JollyHandler),
            ])
