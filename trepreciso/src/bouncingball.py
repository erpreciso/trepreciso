import os
import webapp2
import jinja2

class BouncingBallHandler(webapp2.RequestHandler):
    template_dir = os.path.join(os.path.dirname(__file__), 'pages')
    jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
        autoescape = True)

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    
    def read(self,param):
        return self.request.get(param)
        
    def renderStr(self, template, **params):
        return self.jinja_env.get_template(template).render(params)
        
    def renderPage(self, template, **kw):
        self.write(self.renderStr(template, **kw))
        
    def get(self):
        return self.renderPage("bouncingball.html", page="bouncingball")