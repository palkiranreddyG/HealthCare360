# HEALTHCARE360
##    Configuration

### MongoDB Setup
1. Install MongoDB on your system
2. Create a database named healthcare360
3. The application will automatically create collections as needed

### Google Gemini AI Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to both frontend and backend .env files
3. The AI features will be available once configured

## 🚀 Usage

### For Users
1. *Sign Up/Login* - Create an account or login to access features
2. *Dashboard* - View your health summary and access all features
3. *Family Mode* - Add family members and manage their health records
4. *AI Features* - Use AI symptom checker and mental health companion
5. *Health Records* - Upload and manage medical documents

### For Admins
1. *Doctor Dashboard* - Manage patient consultations and records
2. *Medicine Hub* - Process medicine orders and deliveries
3. *Diagnostic Lab* - Manage lab tests and generate reports

## 🔒 Security Features

- *JWT Authentication* - Secure user sessions
- *Role-based Access* - Different dashboards for users and admins
- *File Upload Security* - Secure document storage
- *Data Encryption* - Sensitive data protection

## 🧪 Testing

### Backend Testing
bash
cd backend
npm test


### Frontend Testing
bash
cd healthone-landing
npm test


## 📝 API Documentation

### Authentication Endpoints
- POST /api/auth/signup - User registration
- POST /api/auth/signin - User login
- GET /api/auth/verify - Verify JWT token

### Health Records Endpoints
- GET /api/health-records/:userId - Get user health records
- POST /api/health-records - Upload new health record
- DELETE /api/health-records/:recordId - Delete health record

### Family Management Endpoints
- GET /api/family/:userId - Get family members
- POST /api/family/:familyId/member - Add family member
- PUT /api/family/:familyId/member/:memberId - Update family member
- DELETE /api/family/:familyId/member/:memberId - Remove family member

### AI Endpoints
- POST /api/analyze-symptoms - AI symptom analysis
- POST /api/gemini/chat - AI mental health chat
- GET /api/insights - Get mental health insights

## 🐛 Troubleshooting

### Common Issues

1. *MongoDB Connection Error*
   - Ensure MongoDB is running
   - Check connection string in .env file

2. *Module Not Found Errors*
   - Run npm install in both frontend and backend directories
   - Clear node_modules and reinstall if needed

3. *Port Already in Use*
   - Change port in .env file
   - Kill existing processes using the port

4. *AI Features Not Working*
   - Verify Gemini API key is correct
   - Check API quota and billing

### Development Tips
- Use npm run dev for backend development with auto-restart
- Check browser console for frontend errors
- Monitor backend logs for API issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##    Team

- *Frontend Development* - React.js, CSS3
- *Backend Development* - Node.js, Express.js, MongoDB
- *AI Integration* - Google Gemini AI
- *UI/UX Design* - Modern, responsive design

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking release notes
- Reading the changelog

---

*HealthCare360°* - Empowering healthcare through AI technology.
##    Configuration

### MongoDB Setup
1. Install MongoDB on your system
2. Create a database named healthcare360
3. The application will automatically create collections as needed

### Google Gemini AI Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to both frontend and backend .env files
3. The AI features will be available once configured

## 🚀 Usage

### For Users
1. *Sign Up/Login* - Create an account or login to access features
2. *Dashboard* - View your health summary and access all features
3. *Family Mode* - Add family members and manage their health records
4. *AI Features* - Use AI symptom checker and mental health companion
5. *Health Records* - Upload and manage medical documents

### For Admins
1. *Doctor Dashboard* - Manage patient consultations and records
2. *Medicine Hub* - Process medicine orders and deliveries
3. *Diagnostic Lab* - Manage lab tests and generate reports

## 🔒 Security Features

- *JWT Authentication* - Secure user sessions
- *Role-based Access* - Different dashboards for users and admins
- *File Upload Security* - Secure document storage
- *Data Encryption* - Sensitive data protection

## 🧪 Testing

### Backend Testing
bash
cd backend
npm test


### Frontend Testing
bash
cd healthone-landing
npm test


## 📝 API Documentation

### Authentication Endpoints
- POST /api/auth/signup - User registration
- POST /api/auth/signin - User login
- GET /api/auth/verify - Verify JWT token

### Health Records Endpoints
- GET /api/health-records/:userId - Get user health records
- POST /api/health-records - Upload new health record
- DELETE /api/health-records/:recordId - Delete health record

### Family Management Endpoints
- GET /api/family/:userId - Get family members
- POST /api/family/:familyId/member - Add family member
- PUT /api/family/:familyId/member/:memberId - Update family member
- DELETE /api/family/:familyId/member/:memberId - Remove family member

### AI Endpoints
- POST /api/analyze-symptoms - AI symptom analysis
- POST /api/gemini/chat - AI mental health chat
- GET /api/insights - Get mental health insights

## 🐛 Troubleshooting

### Common Issues

1. *MongoDB Connection Error*
   - Ensure MongoDB is running
   - Check connection string in .env file

2. *Module Not Found Errors*
   - Run npm install in both frontend and backend directories
   - Clear node_modules and reinstall if needed

3. *Port Already in Use*
   - Change port in .env file
   - Kill existing processes using the port

4. *AI Features Not Working*
   - Verify Gemini API key is correct
   - Check API quota and billing

### Development Tips
- Use npm run dev for backend development with auto-restart
- Check browser console for frontend errors
- Monitor backend logs for API issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##    Team

- *Frontend Development* - React.js, CSS3
- *Backend Development* - Node.js, Express.js, MongoDB
- *AI Integration* - Google Gemini AI
- *UI/UX Design* - Modern, responsive design

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking release notes
- Reading the changelog

---

*HealthCare360°* - Empowering healthcare through AI technology.
