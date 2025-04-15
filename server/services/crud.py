from sqlalchemy.orm import Session
from models.models import Bank, BankAccount
import random


def get_or_create_bank(db: Session):
    """Fetches the bank or creates one if not exists."""
    bank = db.query(Bank).first()
    if not bank:
        bank = Bank()
        db.add(bank)
        db.commit()
        db.refresh(bank)
    return bank


def get_next_account_number(db: Session):
    """Generates a sequential 10-digit account number."""
    last_account = db.query(BankAccount).order_by(BankAccount.id.desc()).first()
    if last_account:
        return str(int(last_account.account_number) + 1)
    return str(random.randint(10 ** 9, 10 ** 10 - 1))


def create_bank_account(db: Session, account_type: str, balance: float):
    """Creates a new bank account only if the balance is greater than 100."""
    if balance < 100:
        return {"error": "Amount is not sufficient to create an account. Minimum balance required is Rs. 101."}

    bank = get_or_create_bank(db)
    account_number = get_next_account_number(db)

    new_account = BankAccount(
        account_number=account_number,
        account_type=account_type,
        balance=balance,
        bank_id=bank.id
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account


def get_bank_details(db: Session):
    """Fetches bank details along with all associated accounts."""
    bank = db.query(Bank).first()
    return bank
