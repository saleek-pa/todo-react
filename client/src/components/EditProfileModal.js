import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { TodoContext } from '../context/Context';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import toast from 'react-hot-toast';

const EditProfileModal = ({ show, setShow }) => {
  const { user, updateUserProfile } = useContext(TodoContext);
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);

      if (selectedImage) {
        data.append('image', selectedImage);
      }

      const response = await updateUserProfile(user._id, data);
      if (response?.status === 200) {
        setShow(false);
        toast.success('Profile updated successfully');
      }
      setSelectedImage(null);
      setPreview(null);
      setFormData({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center gap-5 mb-5">
            <div className="flex flex-1 w-auto flex-col items-start justify-center">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Upload image
              </label>
              <label className="flex flex-col items-center justify-center px-5 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!preview ? (
                    <>
                      <AiOutlineCloudUpload className="text-3xl text-gray-500 mb-4" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  ) : (
                    <img src={preview} alt="Selected" className="object-cover w-1/2" />
                  )}
                </div>
                <input type="file" className="hidden" name="image" onChange={handleImageChange} />
              </label>
            </div>

            <div className="flex-1">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Profile
                </label>
                <img
                  alt="profile"
                  src={
                    user?.image &&
                    `${process.env.REACT_APP_BASE_URL.slice(0, -4)}/uploads/${user.image}`
                  }
                  className="w-1/2"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.trimStart() })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>
          </div>
          <Modal.Footer>
            <Button type="submit">Save</Button>
            <Button color="gray" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
