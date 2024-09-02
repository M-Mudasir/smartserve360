import styles from '../styles/pageheader.module.css'

interface Props {
  name: string;
  title: string;
  previousPath: string;
}

const PageHeader = ({name , previousPath , title} : Props) => {
  return (
    <>
        <div className={styles.head}>
            <div className="pageHead">{title}</div>
            <div className="PrevPath d-flex mt-1">{previousPath}
                 <div className="currentPath"> &nbsp; {name}</div>
            </div>        
        </div>
    </>
  )
}

export default PageHeader
