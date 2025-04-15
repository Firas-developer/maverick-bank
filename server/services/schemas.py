from pydantic import BaseModel
from typing import List

class BankBase(BaseModel):
    name: str
    location: str

class BankAccountBase(BaseModel):
    account_number: str
    account_type: str
    balance: float

class BankCreate(BankBase):
    pass

class BankAccountCreate(BaseModel):
    account_type: str
    balance: float

class BankAccountResponse(BankAccountBase):
    id: int

    class Config:
        orm_mode = True

class BankResponse(BankBase):
    id: int
    accounts: List[BankAccountResponse] = []

    class Config:
        orm_mode = True

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class CustomerLogin(BaseModel):
    email: str
    password: str

# Request model for deposit
class DepositRequest(BaseModel):
    account_number: int
    amount: float

# Request model for withdrawal
class WithdrawRequest(BaseModel):
    account_number: int
    amount: float

class FundTransferRequest(BaseModel):
    sender_account: str
    receiver_account: str
    amount: float