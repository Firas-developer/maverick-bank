import models.models, utils.database
from routes.routes import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.database import SessionLocal
from models.models import Customer
from services.schemas import CustomerCreate, CustomerLogin
from utils.auth import hash_password, verify_password, create_access_token

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173"   # React dev server (127.0.0.1 version)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

models.models.Base.metadata.create_all(bind=utils.database.engine)

app.include_router(router)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SignUp
@app.post("/signup")
def signup_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_customer = db.query(Customer).filter(Customer.email == customer.email).first()
    if existing_customer:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password before storing
    hashed_password = hash_password(customer.password)

    # Create new customer
    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        password=hashed_password
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return {"message": "Customer signed up successfully", "customer_id": new_customer.id}

# Login
@app.post("/login")
def login_customer(customer: CustomerLogin, db: Session = Depends(get_db)):
    # Fetch customer by email
    db_customer = db.query(Customer).filter(Customer.email == customer.email).first()
    if not db_customer:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password
    if not verify_password(customer.password, db_customer.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate access token
    access_token = create_access_token(data={"sub": db_customer.email})
    return {"access_token": access_token, "token_type": "bearer"}

