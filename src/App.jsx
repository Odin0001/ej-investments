import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TrendingUp, LogIn, UserPlus, BarChart2, BookOpen, PieChart, CheckCircle, Menu, X } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { db } from './lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import logo from '/logo.png'
import logoWhite from '/logo-white.png'

function App() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <img src={logo} alt="Logo" className='w-16' />
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-700">Welcome, {user.displayName || 'User'}</span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {user ? (
                  <>
                    <span className="block px-3 py-2 text-gray-700">
                      Welcome, {user.displayName || 'User'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </div>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

function Home() {

  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-blue-600">EJInvestments</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your journey to smart investing starts here. Join thousands of investors making informed decisions.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          {!user ? 
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
          >
            Get Started
          </Link> : 
          <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
          >
          Go to Dashboard
          </Link>
          }
        </div>
      </div>

      <h2 className="mt-16 text-2xl text-center font-bold text-gray-900 sm:text-5xl md:text-3xl md:text-left">How do we invest ?</h2>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Feature
          icon={<BarChart2 className="h-8 w-8 text-blue-600" />}
          title="Forex Trading"
          description="Nothing is better than making proper forex investments using a well data analysis."
          image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        />
        <Feature
          icon={<PieChart className="h-8 w-8 text-blue-600" />}
          title="Stock Market"
          description="We will grow your invested capital with our expert specialists."
          image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        />
        <Feature
          icon={<BookOpen className="h-8 w-8 text-blue-600" />}
          title="Real Estate"
          description="Safe money is the best money."
          image="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        />
      </div>

      {/* How it Works Section */}
      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            number="1"
            title="Create an Account"
            description="Sign up for free and complete your investor profile to get started."
          />
          <Step
            number="2"
            title="Complete and Verify Your Transaction"
            description="You deposit your desired amount of money into our wallet, and take a screenshot of the transacrtion and send it to our support team to verify your transaction."
          />
          <Step
            number="3"
            title="Start Earning"
            description="we stake the money for you and you get up to 3% of your deposited capital per day."
          />
        </div>
        <div className='my-10 text-gray-900 md:text-lg text-md text-center'>
          <p>Disclaimer: the 3% of profits is calculated from your deposit without compounding your profits. You can only request a payout of the profit after at least 24 hours.</p>
          <p>All payments are verified between 7 p.m and 9 p.m London time.</p>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [balance, setBalance] = useState(null)

  const handleDepositMenu = () => {
    setIsDepositOpen(prev => !prev)
  }

  const handleWithdrawMenu = () => {
    setIsWithdrawOpen(prev => !prev)
  }

  useEffect(() => {
    async function fetchBalance() {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Specifically get the balance field from the document
          const userData = docSnap.data();
          setBalance(userData.balance || 0);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      }
    }
    
    fetchBalance();
  }, [user]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {user?.displayName || 'Investor'}!
      </h1>
      <h2 className='text-3xl text-gray-600 my-10'>Your current balance is <span className='text-blue-600'>{balance}$</span></h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={`bg-white p-6 rounded-lg shadow-md overflow-hidden group hover:bg-blue-600 transition-all duration-300 ease cursor-pointer ${isDepositOpen ? 'xl:h-92 h-max' : 'h-18'}`} onClick={handleDepositMenu}>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 group-hover:text-white">Deposit</h2>
          <p className="text-gray-600 group-hover:text-white">1- Choose your prefered crypto wallet.</p>
          <p className="text-gray-600 group-hover:text-white">2- Complete your transaction.</p>
          <p className="text-gray-600 group-hover:text-white">3- Take a screenshot of the transaction from your wallet after its completed.</p>
          <p className="text-gray-600 group-hover:text-white">4- Share the screenshot with our support team to verify the transaction.</p>
          <h2 className="text-xl font-semibold my-4 text-gray-600 group-hover:text-white">Our payment methods</h2>
          <p className="text-gray-600 mb-4 group-hover:text-white">Copy the prefered wallet address:</p>
          <ul className="text-gray-600 group-hover:text-white text-wrap">
            <li>- Litecion (LTC) wallet address: <span className='text-blue-600 group-hover:text-white lg:text-[16px] text-xs'>ltc1qteqggu76z33dss0dpdgxfl2mr3vf7963wsgvxg</span></li>
            <li>- TRON (TRX) & Tether (USDT trc20) wallets address: <span className='text-blue-600 group-hover:text-white lg:text-[16px] text-xs'>TU7zipv2A1jdjCTFNDwzkaVL9ocWbogjem</span></li>
          </ul>
        </div>
        <div className={`bg-white p-6 rounded-lg shadow-md overflow-hidden group hover:bg-red-600 transition-all duration-300 ease cursor-pointer ${isWithdrawOpen ? 'h-46' : 'h-18'}`} onClick={handleWithdrawMenu}>
          <h2 className="text-xl font-semibold mb-4 text-red-600 group-hover:text-white">Withdraw</h2>
          <p className="text-gray-600 group-hover:text-white">Send your wallet ID to our support team to verify your withdrawal through the following email: support@ej-investments.info</p>
        </div>
      </div>
      <p className='mt-10 text-gray-600'>In case of any technical issues, please do not hesitate to reach our support team: support@ej-investments.info</p>
    </div>
  );
}

function Feature({ icon, title, description, image }) {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
      <div className="flex-shrink-0">
        <img className="h-48 w-full object-cover" src={image} alt={title} />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            {icon}
            <h3 className="ml-2 text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-base text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {

  const { user } = useAuth()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logoWhite} alt="Logo" className='w-16' />
            </div>
            <p className="text-gray-400 mb-4">
              Making smart investment decisions accessible to everyone through technology and education.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              {!user ?
                <>
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
                </>
              :  
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              }
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@ej-investments.info</li>
              <li>Phone: +44 020 8947 1859</li>
              <li>Address: 6 Back Lane, London, United Kingdom</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2019 - {new Date().getFullYear()} EJ-Investments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
