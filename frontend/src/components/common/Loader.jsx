import ReactDOM from "react-dom";

export const Loader = () => {
  return ReactDOM.createPortal(
    <section className="loading-wrapper">
      <div className="loader rounded-full overflow-hidden w-40 h-40">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/image/loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>,
    document.getElementById("loader")
  );
};
