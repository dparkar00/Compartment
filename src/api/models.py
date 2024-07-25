from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    categories = db.relationship('Categories', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.email}>'
    
    def getCategories(self):
        return [category.serialize() for category in self.categories]
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "categories": self.getCategories(),
        }
    
class Categories(db.Model):
    __tablename__ = "Categories"
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    categoryName = db.Column(db.String(1000), unique=True, nullable=False)
    listings = db.relationship('Listings', backref='category', lazy='dynamic')
    
    def __repr__(self):
        return f'<Category {self.categoryName}>'
    
    def getListings(self):
        return [listing.serialize() for listing in self.listings]

    def serialize(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "categoryName": self.categoryName,
            "listings": self.getListings()
        }

class Listings(db.Model):
    __tablename__ = "Listings"
    id = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.Integer, db.ForeignKey('Categories.id'), nullable=False)
    listingName = db.Column(db.String(1000), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<Listing {self.listingName}>'

    def serialize(self):
        return {
            "id": self.id,
            "cid": self.cid,
            "listingName": self.listingName,
        }