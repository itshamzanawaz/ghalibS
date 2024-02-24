import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const CheckOutForm = ({setModal,cartTotal,items}) => {
  const router = useRouter();
  
  
  const [formData, setFormData] = useState({
    FullName: '',
    Phone: '',
    Email: '',
    City: '',
    Address: '',
    NearbyPlace: '',
  });


  const iconForField = (fieldName) => {
    switch (fieldName.toLowerCase()) {
      case 'fullname':
        return 'fas fa-user';
      case 'phone':
        return 'fas fa-phone';
      case 'email':
        return 'fas fa-envelope';
      case 'city':
        return 'fas fa-city';
      case 'address':
        return 'fas fa-map-marker-alt';
      case 'nearbyplace':
        return 'fas fa-map-pin';
      default:
        return 'fas fa-question';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api-ap-south-1.hygraph.com/v2/clt05bx260pne07wekcgnv3a2/master",
        {
          query: `
          mutation MyMutation {
            createOrder(
              data: {address: "${formData.Address}", city: "${formData.Address}", email: "${formData.Email}", goodName: "${formData.FullName}", items: "${items}", nearbyPlace: "${formData.NearbyPlace}", phone: "${formData.Phone}", total: ${cartTotal}}
            ) {
              id
              address
              city
              createdAt
              email
              goodName
              items
              nearbyPlace
              phone
            }
          }
          
          `,
        }
      );
  
      const {
        data: { createOrder },
      } = response.data;
      
      console.log("Form created successfully!", createOrder);
      setFormData({
        FullName: "",
        Address: "",
        City: "",
        Email: "",
        Phone: "",
        NearbyPlace: "",
      });
      localStorage.setItem('formId', createOrder.id);
      setModal(false);
      setShowCart(false);
      router.push('/success');
      
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };
  

  return (
    <div>
     
        <div className="formbold-main-wrapper">
          <div className="formbold-form-wrapper">
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((fieldName) => (
                <div className="formbold-mb-5" key={fieldName}>
                  <label htmlFor={fieldName} className="formbold-form-label">
                    <i className={iconForField(fieldName)}></i> {fieldName}
                  </label>
                  <input
                    type="text"
                    name={fieldName.toLowerCase()}
                    id={fieldName.toLowerCase()}
                    placeholder={fieldName}
                    className="formbold-form-input"
                    value={formData[fieldName]}
                    onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    required
                  />
                </div>
              ))}
              <div>
                <button className="formbold-btn">Submit with Total price of Rupees </button>
              </div>
            </form>
          </div>
        </div>
     
    </div>
  );
};

export default CheckOutForm;