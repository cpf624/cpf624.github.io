#encoding:utf-8
# Author:   jhat
# Date:     2015-11-05
# Email:    cpf624@126.com
# Home:     http://jhat.pw
# Vim:      tabstop=4 shiftwidth=4 softtabstop=4
# Describe:

import os
import base64
import hashlib
from Crypto import Random
from Crypto.Cipher import AES

class AESCipher(object):

    def __init__(self, key): 
        self.bs = 32
        self.key = hashlib.sha256(key.encode()).digest()

    def encrypt(self, raw):
        raw = self._pad(raw)
        iv = Random.new().read(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        return base64.b64encode(iv + cipher.encrypt(raw))

    def decrypt(self, enc):
        enc = base64.b64decode(enc)
        iv = enc[:AES.block_size]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        return self._unpad(cipher.decrypt(enc[AES.block_size:])).decode('UTF-8')

    def _pad(self, s):
        return s + (self.bs - len(s) % self.bs) * chr(self.bs - len(s) % self.bs)

    def _unpad(self, s):
        return s[:-ord(s[len(s)-1:])]

def getAccount(account_key):
    from ConfigParser import RawConfigParser, NoOptionError, NoSectionError

    account_file = '.account'

    config = RawConfigParser()
    with open(account_file, 'r') as fp:
        config.readfp(fp)

    account = config.get('account', account_key)
    password = None
    password_section = 'password'
    try:
        password = config.get(password_section, account_key)
    except NoSectionError:
        config.add_section(password_section)
    except NoOptionError:
        pass

    aes = AESCipher(account)
    if password:
        return account, aes.decrypt(password).encode('UTF-8')

    from getpass import getpass
    password = getpass(account + "'s password: ")

    config.set(password_section, account_key, aes.encrypt(password))
    with open(account_file, 'w') as fp:
        config.write(fp)

    return account, password

def getQZoneAccount():
    return getAccount('qq_mail')

__all__ = ['getQZoneAccount']
