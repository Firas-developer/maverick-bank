from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import services.crud, utils.database, services.schemas
from fastapi.responses import JSONResponse
from models.models import BankAccount
from services.schemas import DepositRequest, WithdrawRequest, FundTransferRequest

router = APIRouter()

def get_db():
    db = utils.database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-account", response_model=services.schemas.BankAccountResponse)
def create_account(account_data: services.schemas.BankAccountCreate, db: Session = Depends(get_db)):
    account = services.crud.create_bank_account(db, account_data.account_type, account_data.balance)
    return JSONResponse(
        content={
            "id": account.id,
            "account_number": account.account_number,
            "account_type": account.account_type,
            "balance": account.balance
        },
        status_code=201
    )

@router.get("/bank-details", response_model=services.schemas.BankResponse)
def get_bank(db: Session = Depends(get_db)):
    bank = services.crud.get_bank_details(db)
    return bank

# Deposit money into account
@router.put("/deposit")
def deposit_money(request: DepositRequest, db: Session = Depends(get_db)):
    try:
        # Fetch the account from the database
        account = db.query(BankAccount).filter(BankAccount.account_number == request.account_number).first()

        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        if request.amount <= 0:
            raise HTTPException(status_code=400, detail="Deposit amount must be greater than zero")

        # Update the balance
        account.balance += request.amount
        db.commit()
        db.refresh(account)

        return {
            "message": "Deposit successful",
            "account_number": account.account_number,
            "new_balance": account.balance
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Withdraw money from an account
@router.put("/withdraw")
def withdraw_money(request: WithdrawRequest, db: Session = Depends(get_db)):
    try:
        # Fetch the account from the database
        account = db.query(BankAccount).filter(BankAccount.account_number == request.account_number).first()

        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        if request.amount <= 0:
            raise HTTPException(status_code=400, detail="Withdrawal amount must be greater than zero")

        if account.balance < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient funds")

        # Deduct the amount
        account.balance -= request.amount
        db.commit()
        db.refresh(account)

        return {
            "message": "Withdrawal successful",
            "account_number": account.account_number,
            "new_balance": account.balance
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Search Account by Account Number
@router.get("/account/{account_number}")
def get_account_details(account_number: str, db: Session = Depends(get_db)):
    # Fetch account from DB
    account = db.query(BankAccount).filter(BankAccount.account_number == account_number).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return {
        "account_number": account.account_number,
        "account_type": account.account_type,
        "balance": account.balance,
        "bank_id": account.bank_id
    }

# Get All Bank Accounts
@router.get("/accounts")
def get_all_accounts(db: Session = Depends(get_db)):
    accounts = db.query(BankAccount).all()

    if not accounts:
        return {"message": "No accounts found"}

    return [
        {
            "account_number": account.account_number,
            "account_type": account.account_type,
            "balance": account.balance,
            "bank_id": account.bank_id
        }
        for account in accounts
    ]

# Get All Bank Accounts Sorted by Balance in Descending order
@router.get("/accounts/sorted")
def get_sorted_accounts(db: Session = Depends(get_db)):
    accounts = db.query(BankAccount).order_by(BankAccount.balance.desc()).all()

    if not accounts:
        return {"message": "No accounts found"}

    return [
        {
            "account_number": account.account_number,
            "account_type": account.account_type,
            "balance": account.balance,
            "bank_id": account.bank_id
        }
        for account in accounts
    ]

@router.post("/transfer")
def transfer_funds(request: FundTransferRequest, db: Session = Depends(get_db)):
    sender_account = db.query(BankAccount).filter(BankAccount.account_number == request.sender_account).first()
    receiver_account = db.query(BankAccount).filter(BankAccount.account_number == request.receiver_account).first()

    # Check if both accounts exist
    if not sender_account:
        raise HTTPException(status_code=404, detail="Sender account not found")
    if not receiver_account:
        raise HTTPException(status_code=404, detail="Receiver account not found")

    # Check if sender has sufficient balance
    if sender_account.balance < request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance in sender account")

    # Perform the transfer
    sender_account.balance -= request.amount
    receiver_account.balance += request.amount

    # Commit the transaction
    db.commit()

    return {
        "message": "Transfer successful",
        "sender_account": {
            "account_number": sender_account.account_number,
            "remaining_balance": sender_account.balance,
        },
        "receiver_account": {
            "account_number": receiver_account.account_number,
            "updated_balance": receiver_account.balance,
        }
    }