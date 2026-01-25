import gspread
from google.oauth2.service_account import Credentials
import re
import os
from datetime import datetime

class UserIdentity:
    def __init__(self, email):
        
        SERVICE_ACCOUNT_FILE = "unique-nuance-....json" # google auth certificate
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self._SERVICE_ACCOUNT_FILE_PATH = os.path.join(base_dir, "..", "credential", SERVICE_ACCOUNT_FILE)
        self.email = email
        self.preference = [] 

        SCOPES = [
            'https://www.googleapis.com/auth/spreadsheets',
        ]
        creds = Credentials.from_service_account_file(
            self._SERVICE_ACCOUNT_FILE_PATH, scopes=SCOPES
        )

        gc = gspread.authorize(creds)
        
        SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/.../edit#gid=0' # Spreadsheet url
        sh = gc.open_by_url(SPREADSHEET_URL)

        worksheet = sh.get_worksheet(0)
        self.worksheet = worksheet

    def _is_duplicate_participation(self, email: str):
        email_column = self.worksheet.col_values(2)
        return email in email_column

    def is_valid_info(self, email: str):
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(pattern, email) is not None and not self._is_duplicate_participation(email):
            print(f"✅ {email} is valid address.")
            return True
        print(f"⛔️ {email} is not valid address.")
        return False
    
    def prefer(self, preference = "None"):
        if preference in (None, "None"):
            self.preference = []
        elif isinstance(preference, list):
            self.preference = [str(p) for p in preference]
        else:
            self.preference = [str(preference)]

    def rate(self, rating = -1, feedback: str = ""):
        if not self.email:
            raise Exception("User email is not set.")
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        pref_cell = ", ".join(self.preference) if isinstance(self.preference, list) else str(self.preference)
        row = [now, self.email, pref_cell, rating, feedback]
        self.worksheet.append_row(row, value_input_option='USER_ENTERED')
        print(f"✅ User feedback has been successfully recorded.")
        return row

    def get_user_data(self):
        return self.email
