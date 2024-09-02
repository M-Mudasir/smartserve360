import Carousel from 'react-multi-carousel';
import styles from '../../styles/menuCard.module.css'

function MenuCarousel() {
  const dealsToShow = ['Appetizers', 'Main Course', 'Salads', 'Desserts', 'Beverages', 'Extras']
  return (
    <div>


      <div className={styles.container}>
        <div className={styles.note}>
          Based on this <a href="https://dribbble.com/shots/3127773-Event-Card" target="_blank">dribbble</a>
        </div>
        <article className={styles.cardd}>
          <div className={styles.thumb}></div>
          <div className={styles.infos}>
            <h2 className={styles.title}>new york city<span className={styles.flag}></span></h2>
            <h3 className={styles.date}>november 2 - 4</h3>
            <h3 className={styles.seats}>seats remaining: 2</h3>
            <p className={styles.txt}>
              Join us for our Live Infinity Session in
              beautiful New York City. This is a 3 day
              intensive workshop where you'll learn
              how to become a better version of...
            </p>
            <h3 className={styles.details}>event details</h3>
          </div>
        </article>
      </div>

    </div>
  )
}

export default MenuCarousel