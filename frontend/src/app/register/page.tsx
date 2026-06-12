'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignupMode, setIsSignupMode] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Prevent hydration mismatch by only rendering dynamic content after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignupMode) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      router.push('/notes')
    } catch (error: any) {
      const errorMessage = isSignupMode
        ? error.response?.data?.email?.[0] || error.response?.data?.password?.[0] || 'Registration failed. Please try again.'
        : error.response?.data?.detail || 'Login failed. Please check your credentials.'
      toast({
        variant: 'destructive',
        title: isSignupMode ? 'Registration failed' : 'Login failed',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode)
    setEmail('')
    setPassword('')
  }

  // Show loading state during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FAF1E3]">
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
          <div style={{ width: '188.14px', height: '134px' }}>
            <img 
              src="/images/cat_new_user.png"
              alt="Cat illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 
            className="text-center"
            style={{ 
              color: '#88642A',
              fontSize: '48px',
              fontFamily: 'Inria Serif, serif',
              fontWeight: 700
            }}
          >
            Yay, New Friend!
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#FAF1E3]">
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
      {/* Cat Illustration */}
      <div 
        style={{ 
          width: '188.14px', 
          height: '134px'
        }}
      >
        <img 
          src={isSignupMode ? "/images/cat_new_user.png" : "/images/cactus_old_user.png"}
          alt={isSignupMode ? "Cat illustration" : "Cactus illustration"}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Heading */}
      <h1 
        className="text-center"
        style={{ 
          color: '#88642A',
          fontSize: '48px',
          fontFamily: 'Inria Serif, serif',
          fontWeight: 700
        }}
      >
        {isSignupMode ? "Yay, New Friend!" : "Yay, You're Back!"}
      </h1>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div 
          className="flex flex-col gap-[7px]"
          style={{ 
            width: '384px'
          }}
        >
          <div 
            className="flex items-center gap-2 self-stretch h-[39px] px-[15px] py-[7px] rounded-md"
            style={{ 
              outline: '1px solid #957139',
              outlineOffset: '-1px'
            }}
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent border-none outline-none text-black text-xs font-normal placeholder:text-black"
              style={{ fontFamily: 'Inter, sans-serif', color: '#000000' }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div 
          className="flex flex-col gap-[7px]"
          style={{ 
            width: '384px'
          }}
        >
          <div 
            className="flex items-center gap-2 self-stretch h-[39px] px-[15px] py-[7px] rounded-md"
            style={{ 
              outline: '1px solid #957139',
              outlineOffset: '-1px'
            }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-transparent border-none outline-none text-black text-xs font-normal placeholder:text-black"
              style={{ fontFamily: 'Inter, sans-serif', color: '#000000' }}
            />
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-[6px] px-4 py-3"
          style={{
            width: '384px',
            height: '43px',
            borderRadius: '46px',
            outline: '1px solid #957139',
            outlineOffset: '-1px',
            backgroundColor: 'transparent',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          <span 
            style={{ 
              color: '#957139',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              wordWrap: 'break-word'
            }}
          >
            {isLoading 
              ? (isSignupMode ? 'Creating account...' : 'Logging in...') 
              : (isSignupMode ? 'Sign Up' : 'Login')}
          </span>
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center">
        <button
          onClick={toggleMode}
          type="button"
          className="bg-transparent border-none cursor-pointer"
          style={{ 
            color: '#957139',
            fontSize: '12px',
            fontFamily: 'Inria Serif, serif',
            fontWeight: 400,
            textDecoration: 'underline',
            wordWrap: 'break-word',
            padding: 0
          }}
        >
          {isSignupMode ? "We're already friends!" : "Oops, I've never been here before."}
        </button>
      </div>
    </div>
    </div>
  )
}
