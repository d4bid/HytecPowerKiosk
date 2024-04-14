import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../../components/Spinner";
import { MdOutlineAddBox } from "react-icons/md";
import PartnerSingleCard from "../../../components/Partners/PartnerSingleCard";
import AddPartnerModal from "./AddPartnerModal";

const PartnerList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Add isAdmin state

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/partners")
      .then((response) => {
        setPartners(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    // Listen for newPartnerAdded and partnerUpdated events
    const updatePartners = () => {
      axios
        .get("http://localhost:5555/partners")
        .then((response) => {
          setPartners(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    window.addEventListener('newPartnerAdded', updatePartners);
    window.addEventListener('partnerUpdated', updatePartners);

    // Cleanup the event listeners
    return () => {
      window.removeEventListener('newPartnerAdded', updatePartners);
      window.removeEventListener('partnerUpdated', updatePartners);
    };
  }, []);

  const filteredPartners = selectedType === "all" ? partners : partners.filter(partner => partner.type === selectedType);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Partners List</h1>
        <div className="flex gap-x-4">
          <button
            className={`px-4 py-1 rounded-lg ${selectedType === 'all' ? 'bg-sky-600 text-white' : 'bg-sky-300'}`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-1 rounded-lg ${selectedType === 'company' ? 'bg-sky-600 text-white' : 'bg-sky-300'}`}
            onClick={() => setSelectedType("company")}
          >
            Company
          </button>
          <button
            className={`px-4 py-1 rounded-lg ${selectedType === 'academe' ? 'bg-sky-600 text-white' : 'bg-sky-300'}`}
            onClick={() => setSelectedType("academe")}
          >
            Academe
          </button>
        </div>
        <MdOutlineAddBox className="text-sky-800 text-4xl cursor-pointer" onClick={handleOpenAddModal} />
      </div>
      <div className="flex justify-end mb-4">
        <label className="text-gray-500 mr-2">Admin Mode:</label>
        <input type="checkbox" checked={isAdmin} onChange={handleToggleAdmin} />
      </div>
      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPartners.map(partner => (
            <PartnerSingleCard 
              key={partner._id} 
              partner={partner} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      )}
      {showAddModal && <AddPartnerModal onClose={handleCloseAddModal} />}
    </div>
  );
};

export default PartnerList;
