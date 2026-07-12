import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle, FiCamera, FiCheck, FiCheckCircle, FiEdit3, FiImage, FiLock, FiMail, FiMapPin, FiPhone, FiRefreshCw, FiSave, FiShield, FiUpload, FiUser, FiX } from "react-icons/fi";

import { getUserProfile, sendVerificationEmail, updateUserCover, updateUserProfile } from "@/redux/slices/authSlice";
import { Loader, Wrapper } from "@/routes";
const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
  bio: "",
};

const MAX_BIO_LENGTH = 500;

const getAvatarUrl = (avatar) => {
  if (typeof avatar === "string") {
    return avatar;
  }

  return avatar?.url || avatar?.filePath || "";
};

const getCoverUrl = (cover) => {
  if (typeof cover === "string") {
    return cover;
  }

  return cover?.filePath || cover?.url || "";
};

const validateImage = (file, maxSizeMB) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return "Only PNG, JPG, JPEG and WEBP images are allowed.";
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be smaller than ${maxSizeMB}MB.`;
  }

  return "";
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
};

const clearObjectUrl = (reference) => {
  if (reference.current) {
    URL.revokeObjectURL(reference.current);

    reference.current = "";
  }
};

export const MyProfile = () => {
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  const avatarInputRef = useRef(null);

  const coverInputRef = useRef(null);

  const avatarObjectUrlRef = useRef("");

  const coverObjectUrlRef = useRef("");

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");

  const [coverPreview, setCoverPreview] = useState("");

  const [saving, setSaving] = useState(false);

  const [coverUploading, setCoverUploading] = useState(false);

  const [verificationSending, setVerificationSending] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!editing) {
      setForm({
        name: user.name || "",
        phone: String(user.phone || ""),
        address: user.address || "",
        bio: user.bio || "",
      });
    }

    if (!avatarObjectUrlRef.current && !avatarFile) {
      setAvatarPreview(getAvatarUrl(user.avatar));
    }

    if (!coverObjectUrlRef.current) {
      setCoverPreview(getCoverUrl(user.cover));
    }
  }, [user, editing, avatarFile]);

  useEffect(() => {
    return () => {
      clearObjectUrl(avatarObjectUrlRef);

      clearObjectUrl(coverObjectUrlRef);
    };
  }, []);

  const profileCompletion = useMemo(() => {
    if (!user) {
      return 0;
    }

    const fields = [form.name, user.email, form.phone, form.address, form.bio, avatarPreview, coverPreview];

    const completed = fields.filter((value) => String(value || "").trim().length > 0).length;

    return Math.round((completed / fields.length) * 100);
  }, [form, user, avatarPreview, coverPreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImage(file, 2);

    if (validationError) {
      toast.error(validationError);

      event.target.value = "";

      return;
    }

    clearObjectUrl(avatarObjectUrlRef);

    const objectUrl = URL.createObjectURL(file);

    avatarObjectUrlRef.current = objectUrl;

    setAvatarFile(file);
    setAvatarPreview(objectUrl);
  };

  const removeAvatarSelection = () => {
    clearObjectUrl(avatarObjectUrlRef);

    setAvatarFile(null);

    setAvatarPreview(getAvatarUrl(user?.avatar));

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImage(file, 5);

    if (validationError) {
      toast.error(validationError);

      event.target.value = "";

      return;
    }

    const previousCover = getCoverUrl(user?.cover);

    clearObjectUrl(coverObjectUrlRef);

    const objectUrl = URL.createObjectURL(file);

    coverObjectUrlRef.current = objectUrl;

    setCoverPreview(objectUrl);

    try {
      setCoverUploading(true);

      const formData = new FormData();

      formData.append("cover", file);

      await dispatch(updateUserCover(formData)).unwrap();

      const freshUser = await dispatch(getUserProfile()).unwrap();

      clearObjectUrl(coverObjectUrlRef);

      setCoverPreview(getCoverUrl(freshUser.cover));

      toast.success("Cover image updated successfully.");
    } catch (error) {
      clearObjectUrl(coverObjectUrlRef);

      setCoverPreview(previousCover);

      toast.error(getErrorMessage(error, "Unable to update cover image."));
    } finally {
      setCoverUploading(false);

      event.target.value = "";
    }
  };

  const handleCancel = () => {
    clearObjectUrl(avatarObjectUrlRef);

    setAvatarFile(null);

    setAvatarPreview(getAvatarUrl(user?.avatar));

    setForm({
      name: user?.name || "",
      phone: String(user?.phone || ""),
      address: user?.address || "",
      bio: user?.bio || "",
    });

    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.name.trim().length < 3) {
      toast.error("Name must contain at least 3 characters.");

      return;
    }

    if (form.phone.trim() && !/^\+?[0-9]{7,15}$/.test(form.phone.trim())) {
      toast.error("Please provide a valid phone number.");

      return;
    }

    if (form.bio.trim().length > MAX_BIO_LENGTH) {
      toast.error(`Biography must not exceed ${MAX_BIO_LENGTH} characters.`);

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());

      formData.append("phone", form.phone.trim());

      formData.append("address", form.address.trim());

      formData.append("bio", form.bio.trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await dispatch(updateUserProfile(formData)).unwrap();

      const freshUser = await dispatch(getUserProfile()).unwrap();

      clearObjectUrl(avatarObjectUrlRef);

      setAvatarFile(null);

      setAvatarPreview(getAvatarUrl(freshUser.avatar));

      setForm({
        name: freshUser.name || "",
        phone: String(freshUser.phone || ""),
        address: freshUser.address || "",
        bio: freshUser.bio || "",
      });

      setEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleVerification = async () => {
    try {
      setVerificationSending(true);

      await dispatch(sendVerificationEmail()).unwrap();

      toast.success("Verification email sent successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to send verification email."));
    } finally {
      setVerificationSending(false);
    }
  };

  if (isLoading && !user) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Wrapper className="overflow-hidden p-0">
        <div className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-[24px] border border-[#282828] bg-[#191919] p-8 text-center shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
          <span className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

          <span className="flex size-14 items-center justify-center rounded-2xl border border-rose-400/[0.14] bg-rose-400/[0.05] text-xl text-rose-300">
            <FiAlertCircle />
          </span>

          <h2 className="mt-4 text-sm font-black text-[#F1F1F1]">Unable to load profile</h2>

          <p className="mt-2 max-w-md text-[10px] leading-5 text-[#7B7B7B]">Your profile information could not be retrieved.</p>

          <button
            type="button"
            onClick={() => dispatch(getUserProfile())}
            className="group relative mt-5 inline-flex h-10 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.11] bg-[linear-gradient(180deg,#282828_0%,#202020_100%)] px-4 text-[9px] font-black text-[#F1F1F1] shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[linear-gradient(180deg,#303030_0%,#252525_100%)]"
          >
            <FiRefreshCw size={12} />
            Try again
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <section className="space-y-5 pb-10">
      {/* ==========================================================
          PROFILE HERO
      ========================================================== */}

      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[26px] border border-[#282828] bg-[#191919] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
          <span className="pointer-events-none absolute inset-x-16 top-0 z-50 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />

          <div className="relative h-[230px] overflow-hidden bg-[#101010] sm:h-[270px]">
            {coverPreview ? (
              <img src={coverPreview} alt={`${user.name} cover`} className="size-full object-cover transition-transform duration-700 hover:scale-[1.015]" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_75%_5%,rgba(255,255,255,0.075),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(255,255,255,0.035),transparent_40%),linear-gradient(135deg,#222222_0%,#191919_48%,#101010_100%)]">
                <span className="flex size-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-2xl text-[#727272] shadow-[0_16px_36px_rgba(0,0,0,0.28)]">
                  <FiImage />
                </span>
              </div>
            )}

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/25 to-black/25" />

            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#191919] via-[#191919]/70 to-transparent" />

            <span className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border-[48px] border-white/[0.016]" />

            <div className="absolute inset-x-5 top-5 z-20 flex items-start justify-between gap-3 sm:inset-x-6">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#101010]/80 px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#A4A4A4] shadow-[0_12px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <FiShield size={11} />
                Account profile
              </span>

              <button
                type="button"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}
                className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.1] bg-[#101010]/80 px-3.5 text-[9px] font-bold text-[#B9B9B9] shadow-[0_12px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[#222222] hover:text-[#F1F1F1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                <FiCamera size={12} className="relative transition-transform duration-300 group-hover:scale-110" />

                <span className="relative">{coverUploading ? "Uploading..." : "Change cover"}</span>
              </button>

              <input ref={coverInputRef} type="file" name="cover" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleCoverChange} className="hidden" />
            </div>
          </div>

          <div className="relative px-5 pb-6 sm:px-7">
            <div className="-mt-[68px] flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative size-28 shrink-0 rounded-[25px] border-[5px] border-[#191919] bg-[#222222] shadow-[0_20px_48px_rgba(0,0,0,0.5)] sm:size-32">
                  <div className="size-full overflow-hidden rounded-[19px] border border-white/[0.1]">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={user.name} className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-[linear-gradient(145deg,#282828,#191919)] text-4xl text-[#727272]">
                        <FiUser />
                      </div>
                    )}
                  </div>

                  <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-[3px] border-[#191919] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.42)]" />

                  {editing && (
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      aria-label="Change avatar"
                      className="group absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-xl border border-white/[0.13] bg-[#222222] text-[#F1F1F1] shadow-[0_12px_28px_rgba(0,0,0,0.44)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-[#282828]"
                    >
                      <FiUpload size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </button>
                  )}

                  <input ref={avatarInputRef} type="file" name="avatar" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleAvatarChange} className="hidden" />
                </div>

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-xl font-black capitalize tracking-[-0.035em] text-[#F1F1F1] sm:text-2xl">{user.name}</h1>

                    {user.isVerified && (
                      <span title="Verified account" className="flex size-6 items-center justify-center rounded-full border border-emerald-400/[0.14] bg-emerald-400/[0.06] text-emerald-300">
                        <FiCheckCircle size={13} />
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 max-w-lg truncate text-[9px] text-[#7B7B7B]">{user.email || "No email address"}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-7 items-center rounded-lg border border-[#282828] bg-[#101010] px-2.5 text-[8px] font-bold capitalize text-[#A4A4A4]">{user.role || "User"}</span>

                    <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-emerald-400/[0.1] bg-emerald-400/[0.035] px-2.5 text-[8px] font-semibold text-emerald-300/75">
                      <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.35)]" />
                      Active account
                    </span>

                    <span className="inline-flex h-7 items-center rounded-lg border border-[#282828] bg-[#101010] px-2.5 text-[8px] font-semibold text-[#7B7B7B]">{profileCompletion}% complete</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <NavLink
                  to="/change-password"
                  className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#282828] bg-[#101010] px-4 text-[9px] font-bold text-[#A4A4A4] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#222222] hover:text-[#F1F1F1]"
                >
                  <FiLock size={12} className="transition-transform duration-300 group-hover:scale-110" />
                  Change password
                </NavLink>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.11] bg-[linear-gradient(180deg,#2A2A2A_0%,#202020_100%)] px-4 text-[9px] font-black text-[#F1F1F1] shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[linear-gradient(180deg,#323232_0%,#262626_100%)]"
                  >
                    <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <FiEdit3 size={12} className="relative" />

                    <span className="relative">Edit profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* ==========================================================
          CONTENT GRID
      ========================================================== */}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        <Wrapper className="overflow-hidden p-0">
          <div className="relative rounded-[24px] border border-[#282828] bg-[#191919] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.3)] sm:p-6">
            <span className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

            <div className="flex flex-col gap-4 border-b border-[#282828] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#222222] text-[#A4A4A4]">
                  <FiUser size={15} />
                </span>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.17em] text-[#727272]">Personal details</p>

                  <h2 className="mt-1 text-base font-black tracking-[-0.025em] text-[#F1F1F1]">Profile information</h2>

                  <p className="mt-1.5 max-w-lg text-[9px] leading-5 text-[#7B7B7B]">Manage your identity, contact information and public biography.</p>
                </div>
              </div>

              {editing && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/[0.12] bg-amber-400/[0.045] px-3 py-1.5 text-[8px] font-bold text-amber-300/80">
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  Editing enabled
                </span>
              )}
            </div>

            {avatarFile && editing && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/[0.12] bg-amber-400/[0.04] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-amber-400/[0.12] bg-amber-400/[0.05] text-amber-300">
                    <FiUpload size={13} />
                  </span>

                  <div>
                    <p className="text-[9px] font-bold text-[#D8D8D8]">New avatar selected</p>

                    <p className="mt-0.5 text-[8px] text-[#727272]">Save your changes to upload the selected image.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeAvatarSelection}
                  aria-label="Remove selected avatar"
                  className="flex size-8 items-center justify-center rounded-lg border border-rose-400/[0.12] bg-rose-400/[0.04] text-rose-300 transition-all duration-300 hover:border-rose-400/[0.2] hover:bg-rose-400/[0.08]"
                >
                  <FiX size={13} />
                </button>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileField icon={<FiUser />} label="Display name" name="name" value={form.name} disabled={!editing} onChange={handleChange} />

              <ProfileField icon={<FiMail />} label="Email address" name="email" value={user.email || ""} disabled locked onChange={() => {}} />

              <ProfileField icon={<FiPhone />} label="Phone number" name="phone" value={form.phone} disabled={!editing} placeholder="Add phone number" onChange={handleChange} />

              <ProfileField icon={<FiMapPin />} label="Address" name="address" value={form.address} disabled={!editing} placeholder="Add your address" onChange={handleChange} />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="bio" className="text-[9px] font-bold text-[#C8C8C8]">
                  Biography
                </label>

                <span className="rounded-md border border-[#282828] bg-[#101010] px-2 py-1 text-[7px] font-bold tabular-nums text-[#727272]">
                  {form.bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>

              <textarea
                id="bio"
                name="bio"
                rows={6}
                value={form.bio}
                onChange={handleChange}
                disabled={!editing}
                maxLength={MAX_BIO_LENGTH}
                placeholder="Tell people something about yourself..."
                className="min-h-[150px] w-full resize-y rounded-2xl border border-[#282828] bg-[#101010] p-4 text-[10px] leading-6 text-[#D8D8D8] caret-[#F1F1F1] outline-none transition-all duration-300 placeholder:text-[#4E4E4E] hover:border-white/[0.1] focus:border-white/[0.18] focus:bg-[#151515] focus:ring-4 focus:ring-white/[0.025] disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-[#7B7B7B]"
              />
            </div>

            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#282828] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#282828] bg-[#101010] px-5 text-[9px] font-bold text-[#A4A4A4] transition-all duration-300 hover:border-white/[0.14] hover:bg-[#222222] hover:text-[#F1F1F1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiX size={12} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.11] bg-[linear-gradient(180deg,#2A2A2A_0%,#202020_100%)] px-5 text-[9px] font-black text-[#F1F1F1] shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[linear-gradient(180deg,#323232_0%,#262626_100%)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <FiSave size={12} />

                  {saving ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </Wrapper>

        {/* ==========================================================
            RIGHT COLUMN
        ========================================================== */}

        <aside className="space-y-5">
          <Wrapper className="overflow-hidden p-0">
            <div className="relative rounded-[24px] border border-[#282828] bg-[#191919] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
              <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#222222] text-lg text-[#D8D8D8]">
                  <FiShield />
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.12em] ${
                    user.isVerified ? "border-emerald-400/[0.12] bg-emerald-400/[0.045] text-emerald-300" : "border-amber-400/[0.12] bg-amber-400/[0.045] text-amber-300"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${user.isVerified ? "bg-emerald-400" : "bg-amber-400"}`} />

                  {user.isVerified ? "Verified" : "Action required"}
                </span>
              </div>

              <h2 className="mt-4 text-sm font-black text-[#F1F1F1]">Account status</h2>

              <p className="mt-1.5 text-[9px] leading-5 text-[#7B7B7B]">Review your verification, membership and access role.</p>

              <div className="mt-5 space-y-2">
                <StatusRow label="Verification" value={user.isVerified ? "Verified" : "Not verified"} tone={user.isVerified ? "success" : "warning"} />

                <StatusRow label="Membership" value={user.paid ? "Premium" : "Standard"} tone={user.paid ? "success" : "neutral"} />

                <StatusRow label="Role" value={user.role || "User"} tone="neutral" />
              </div>

              {!user.isVerified && (
                <button
                  type="button"
                  onClick={handleVerification}
                  disabled={verificationSending}
                  className="group relative mt-5 flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.11] bg-[linear-gradient(180deg,#2A2A2A_0%,#202020_100%)] text-[9px] font-black text-[#F1F1F1] shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[linear-gradient(180deg,#323232_0%,#262626_100%)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <FiMail size={12} />

                  {verificationSending ? "Sending email..." : "Send verification email"}
                </button>
              )}
            </div>
          </Wrapper>

          <Wrapper className="overflow-hidden p-0">
            <div className="relative rounded-[24px] border border-[#282828] bg-[#191919] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
              <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#727272]">Profile completion</p>

                  <h3 className="mt-1.5 text-2xl font-black tracking-[-0.04em] text-[#F1F1F1]">{profileCompletion}%</h3>
                </div>

                <span className="flex size-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#222222] text-[#A4A4A4]">
                  <FiCheck size={16} />
                </span>
              </div>

              <div className="mt-5 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index < Math.ceil(profileCompletion / 10) ? "bg-[#D4D4D4] shadow-[0_0_8px_rgba(255,255,255,0.12)]" : "bg-[#282828]"}`}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-[#282828] bg-[#101010] p-3">
                <p className="text-[8px] leading-5 text-[#727272]">Complete your contact details, biography, avatar and cover image to improve your profile.</p>
              </div>
            </div>
          </Wrapper>

          <Wrapper className="overflow-hidden p-0">
            <div className="relative rounded-[24px] border border-[#282828] bg-[#191919] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
              <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#222222] text-[#A4A4A4]">
                  <FiLock size={14} />
                </span>

                <div>
                  <h3 className="text-[10px] font-black text-[#F1F1F1]">Security settings</h3>

                  <p className="mt-1 text-[8px] leading-5 text-[#727272]">Keep your account secure by updating your password regularly.</p>
                </div>
              </div>

              <NavLink
                to="/change-password"
                className="group mt-4 flex h-9 w-full items-center justify-between rounded-xl border border-[#282828] bg-[#101010] px-3.5 text-[8px] font-bold text-[#A4A4A4] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#222222] hover:text-[#F1F1F1]"
              >
                <span>Change password</span>

                <FiLock size={11} className="transition-transform duration-300 group-hover:scale-110" />
              </NavLink>
            </div>
          </Wrapper>
        </aside>
      </form>
    </section>
  );
};

/* ==========================================================================
   PROFILE FIELD
   ========================================================================== */

const ProfileField = ({ icon, label, name, value, disabled = false, onChange, placeholder = "", locked = false }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={name} className="text-[9px] font-bold text-[#C8C8C8]">
          {label}
        </label>

        {locked && (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#282828] bg-[#101010] px-1.5 py-0.5 text-[7px] font-semibold text-[#727272]">
            <FiLock size={8} />
            Locked
          </span>
        )}
      </div>

      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 text-[#5E5E5E] transition-colors duration-300 group-focus-within:text-[#B9B9B9]">{icon}</span>

        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-[#282828] bg-[#101010] pl-11 pr-4 text-[10px] text-[#D8D8D8] caret-[#F1F1F1] outline-none transition-all duration-300 placeholder:text-[#4E4E4E] hover:border-white/[0.1] focus:border-white/[0.18] focus:bg-[#151515] focus:ring-4 focus:ring-white/[0.025] disabled:cursor-not-allowed disabled:bg-[#151515] disabled:text-[#7B7B7B]"
        />
      </div>
    </div>
  );
};

ProfileField.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  locked: PropTypes.bool,
};

/* ==========================================================================
   STATUS ROW
   ========================================================================== */

const StatusRow = ({ label, value, tone = "neutral" }) => {
  const toneClasses = {
    success: {
      text: "text-emerald-300",
      dot: "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.35)]",
      background: "bg-emerald-400/[0.025]",
      border: "border-emerald-400/[0.08]",
    },

    warning: {
      text: "text-amber-300",
      dot: "bg-amber-400 shadow-[0_0_7px_rgba(251,191,36,0.3)]",
      background: "bg-amber-400/[0.025]",
      border: "border-amber-400/[0.08]",
    },

    neutral: {
      text: "text-[#B4B4B4]",
      dot: "bg-[#727272]",
      background: "bg-[#101010]",
      border: "border-[#282828]",
    },
  };

  const currentTone = toneClasses[tone] || toneClasses.neutral;

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-3 ${currentTone.background} ${currentTone.border}`}>
      <span className="text-[8px] font-semibold text-[#727272]">{label}</span>

      <span className={`inline-flex items-center gap-1.5 text-[8px] font-black capitalize ${currentTone.text}`}>
        <span className={`size-1.5 rounded-full ${currentTone.dot}`} />

        {value}
      </span>
    </div>
  );
};

StatusRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(["success", "warning", "neutral"]),
};
