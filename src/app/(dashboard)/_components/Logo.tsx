import Image from 'next/image'

const Logo = () => {
  return (
    <Image
        height={130}
        width={130}
        src="/next.svg"
        alt="Logo"
     />
  )
}

export default Logo