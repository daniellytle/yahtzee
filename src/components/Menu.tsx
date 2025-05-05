import { HowToPlayModal } from "./HowToPlayModal"

const Menu = () => {
  return (
    <div className="flex flex-row items-center justify-between w-4/5">
      <a className="text-4xl font-bold hover:opacity-50" href="/">
        Optimal Yahtzee
      </a>
      <div className="flex flex-row gap-x-10 font-bold">
        <HowToPlayModal className="" />
        <a target="_blank" href="https://github.com/daniellytle/yahtzee">
          Github
        </a>
        <a target="_blank" href="https://dwil.xyz/">
          About
        </a>
      </div>
    </div>
  )
}

export default Menu
