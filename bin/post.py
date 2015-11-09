#!/usr/bin/env python
#encoding:utf-8
# Author:   Jhat
# Date:     2015-10-27
# Email:    cpf624@126.com
# Home:     http://jhat.pw
# Vim:      tabstop=4 shiftwidth=4 softtabstop=4
# Describe:

import sys
reload(sys)
sys.setdefaultencoding('UTF-8')

import re
from smtplib import SMTP_SSL
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from pynliner import Pynliner
from pyquery import PyQuery

import account_manager

def format_post(url):
    """
    pq = PyQuery(url=url)
    title = pq('h1.heading-title').html()
    content = pq('div.post-content')
    content.css({'padding': '10px 20px', 'background-color': '#444', 'color': '#DDD',
        'border-radius': '10px', 'box-shadow': '0 3px 10px rgba(0,0,0,0.1)',
        'box-sizing': 'border-border', 'display': 'block', 'font-size': '16px',
        'line-height': '1.42857143'})
    content('.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6').css({'color': '#F0E7D5',
        'font-family': 'inherit', 'font-weight': '500', 'line-height': '1.1'})
    content('''.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,
        .h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h1 .small,
        h1 small,h2 .small,h2 small,h3 .small,h3 small,h4 .small,
        h4 small,h5 .small,h5 small,h6 .small,h6 small''').css({
            'font-weight': '400', 'line-height': '1'})
    content('.h1,.h2,.h3,h1,h2,h3').css({'margin-top': '20px', 'margin-bottom': '10px'})
    content('''.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,
        h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small''').css({
                'font-size': '65%'})
    content('.h4,.h5,.h6,h4,h5,h6').css({'margin-top': '10px', 'margin-bottom': '10px'})
    content('''.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,
        h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small''').css({
            'font-size': '75%'})
    content('.h1,h1').css({'font-size': '36px'})
    content('.h2,h2').css({'font-size': '30px'})
    content('.h3,h3').css({'font-size': '24px'})
    content('.h4,h4').css({'font-size': '18px'})
    content('.h5,h5').css({'font-size': '14px'})
    content('.h6,h6').css({'font-size': '12px'})
    content('p').css({'margin': '0 0 10px'})
    content('div.post-content > p').css({'text-indent': '2em', 'white-space': 'pre-wrap'})

    content('div.highlight').css({'color': '#F0E7D5', 'background-color': '#333',
        'margin': '0 1em', 'display': 'block'})
    html = content.outer_html()
    """

    html = Pynliner().from_url(url).run()
    pq = PyQuery(html)
    title = pq('h1.heading-title').html()
    content = pq('div.post-content').outer_html()
    html = """<!DOCTYPE html>
    <html lang="zh-CN">
    <head></head>
    <body>
    <div style='background-color: #444; color: #DDD; padding: 10px 20px;'>
    <div class='post-title' style='text-align: center;'>
        <a style='color: #DDD' href='%s'><h1>%s</h1></a>
    </div>
    %s
    </div>
    </body>
    </html>
    """ % (url, title, content)
    html = re.sub(r'display:\s*none;{0,1}\s*', '', html)
    return title, html

def postQZone(title, html):
    account, password = account_manager.getQZoneAccount()
    qmail_account = account + '@qq.com'
    smtp = SMTP_SSL('smtp.qq.com', 465)
    smtp.login(qmail_account, password)

    fromaddr = qmail_account
    toaddrs = (account + '@qzone.qq.com',)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = Header(title, 'UTF-8')
    msg['From'] = r'%s<%s>' % (Header('Jhat', 'UTF-8'), fromaddr)
    msg['To'] = ', '.join(toaddrs)

    html_attach = MIMEText(html, 'html', 'UTF-8')
    msg.attach(html_attach)

    smtp.sendmail(fromaddr, toaddrs, msg.as_string())

    smtp.quit()

if __name__ == '__main__':
    if len(sys.argv) == 2:
        title, html = format_post(sys.argv[1])
        postQZone(title, html)
    else:
        print 'post.py url'
