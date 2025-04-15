from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from utils.database import Base

class Bank(Base):
    __tablename__ = "banks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Maverick Bank")
    location = Column(String(100), default="Chennai")

    # Providing Bank Table One to Many Relationship to number of bank account tables
    accounts = relationship("BankAccount", back_populates="bank")

class BankAccount(Base):
    __tablename__ = "bank_accounts"
    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(10), unique=True, nullable=False)
    account_type = Column(String(50), nullable=False)
    balance = Column(Float, nullable=False)

    # Using bank_id as foreign key connecting bank and bank account table
    bank_id = Column(Integer, ForeignKey("banks.id"))

    # Maintaining Many to One Relationship
    bank = relationship("Bank", back_populates="accounts")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    password = Column(String(100), nullable=False)

