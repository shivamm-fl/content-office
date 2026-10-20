LIMIT = 500
asked = 2000
reply = "yes"  # model stub
approved = reply == "yes" and asked <= LIMIT
print("Approved:", approved)
