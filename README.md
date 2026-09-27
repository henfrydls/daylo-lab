# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events that Daylo 1.4.0 will put in front of somebody in a few days.

## Where it came from

Built from `henfrydls/daylo` at commit `71e7f470801a694418b693646b684fc3f94f08a7`, which is
v1.4.0 on `main`. Nothing here is written by hand except the differences below.

## What is different, and why each one

| Change                                                                  | Why                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` is `com.daylo.lab`                                         | so a lab copy keeps its own data and cannot touch the data of a real Daylo on the same machine                                                                                                                                                                                                                                                  |
| the window title says **Daylo Lab**                                     | so you can tell which one you are looking at. The product name stays `Daylo`, because every artifact name in the release workflow and every pattern in the manifest composer is built from it, and the point of this repository is to run that path unchanged                                                                                   |
| the updater endpoint is this repository's `latest.json`                 | it is the address under test                                                                                                                                                                                                                                                                                                                    |
| the signing key is a **test key**, `F5D1D1CD8B8DFCA9`                   | the key that signs real Daylo updates is not in this repository and never will be. This one signs nothing anybody has installed                                                                                                                                                                                                                 |
| the anonymous check-in is **off at compile time**                       | a lab copy has an empty profile, an empty profile is a new installation, and a new installation turns the check-in on. That would write rows into the panel that counts real installations. It is not an environment variable here, because a variable is something to forget on five runners and again on the machine that installs the result |
| the Android job is off                                                  | Android has no updater. A phone updates from a store or from a new APK, so it is outside the path this repository runs                                                                                                                                                                                                                          |
| four workflows are gone (Flatpak, MSIX, the MSIX probe, the test build) | none of them is part of the update path, and each one costs runner minutes on a private repository                                                                                                                                                                                                                                              |

`release.yml`, `ci.yml` and the signing-secret check are **unchanged**, and so is every
script they call. That is the whole idea: if the manifest composer refuses something here,
it will refuse the same thing there.

## What a release here proves

1. Five platforms build and upload their artifacts and their signatures.
2. `scripts/updater-manifest.js` composes one `latest.json` from them, refusing if a
   platform is missing, if two artifacts claim one platform, or if the release note is
   empty, too long, or word for word the previous one.
3. The address the app actually reads, `/releases/latest/download/latest.json`, gives back
   the version just published.
4. A copy of the earlier version, running, is offered the later one, takes it, verifies the
   signature, installs it and comes back on the new version.

Step 4 is the one nothing else could prove.

---

# The round

This is the rehearsal: install the lab's 1.4.0, let it find the lab's 1.4.1, and watch the
whole thing happen. It is the same code that will do it in Daylo 1.4.0, pointed at this
repository instead of the real one.

**Write down anything that does not match what is described here, in the words you would
use to tell somebody what you saw.** A step that goes differently is worth more than a
step that goes as written.

## Where to get the lab's 1.4.0

Everything is under the **v1.4.0** release of this repository, not "latest": latest will be
1.4.1, which is the thing being updated to.

| System                  | File                            |
| ----------------------- | ------------------------------- |
| Windows (Intel or AMD)  | `Daylo-windows-x64-setup.exe`   |
| Windows on ARM          | `Daylo-windows-arm64-setup.exe` |
| Mac with Apple chip     | `Daylo-macos-apple-silicon.dmg` |
| Mac with Intel          | `Daylo-macos-intel.dmg`         |
| Linux, Debian or Ubuntu | `Daylo-linux-amd64.deb`         |
| Linux, anything else    | `Daylo_1.4.0_amd64.AppImage`    |

Each one lives at
`https://github.com/henfrydls/daylo-lab/releases/download/v1.4.0/<the file name>`.

The first time each system opens it there is a warning about an unidentified developer.
It is the same warning the real Daylo gets, and the release page of the real repository
says how to get past it on each system.

## What you should see, in order

**1. It opens.** The window is titled **Daylo Lab**. This is not the real Daylo and it
keeps its own data: nothing you do here touches your habits.

There is **no line about the anonymous check-in and no check-in entry in the menu**. That
is on purpose in this build and it is the one difference you will notice that is not about
updating.

**2. A second or two later, a line appears under the header.** Not immediately: it appears
when the question to GitHub comes back.

> (an icon) **Daylo 1.4.1 is out.** Update ✕

The icon on the left is the same one the menu entry has. **Update** is a link, not a
button. The ✕ on the right reads "Later" to a screen reader.

**3. Press the ✕.** The line goes. A small green dot appears on the three dots at the top
right. Open the menu: **Check for new versions** has the same dot next to it.

The dot means the offer is still there. It is not a warning and there is nothing wrong.

**4. Open Check for new versions.** The sheet has one line saying **Daylo 1.4.1 is out.**,
one line saying **Daylo asks GitHub and sends nothing about you.**, and two buttons:
**Stop checking automatically** on the left and **Update** on the right.

Press **Stop checking automatically**: the button's words change to **Start checking
automatically** and nothing else happens. That word change is the whole acknowledgement.
Press it again to turn it back on.

Close the sheet. The dot is still there.

**5. Press Update.** Either from the sheet or from the line: the sheet closes and the line
takes over.

- **Downloading… 42%** The number climbs. It stops at 99 rather than 100, on purpose:
  what happens after the last byte is the signature being checked.
- **Installing. Daylo will close and open again.**
- The app closes and comes back by itself.

On **Windows** the installer does the closing and reopening. On **Mac** and on the
**AppImage** the app does it itself. Either way you should not have to open it again by
hand. If you do, write down which system it happened on.

**6. It came back.** Open the menu: the bottom row says **v1.4.1**. The line about a new
version is gone, because there is no newer version to offer.

That is the whole path: asked, offered, downloaded, verified, installed, and back.

## The Debian and Ubuntu package is different, on purpose

If you installed the `.deb`, step 2 says the same sentence but the link says **Get it from
the downloads page**, and pressing it opens the downloads page of the real Daylo in your
browser. It does not install anything and it should not.

The reason is that installing a `.deb` runs the package manager as administrator and asks
for your password. Daylo does not ask anybody for that, so where it cannot replace itself
quietly, it points instead.

## If you want to do the round again

Uninstall and install the lab's 1.4.0 again. The line is shown once per version, so a copy
that has already been offered 1.4.1 will not offer it a second time: it leaves the dot on
the menu instead.

---

# Publishing a lab release

Two tags, in this order. Each one is a full release: five platforms, their signatures, and
one `latest.json` composed from them.

    git tag v1.4.0 && git push origin v1.4.0

Then, once that run is finished:

    npm version patch --no-git-tag-version
    # changelog.d/RELEASE-NOTE.md has to say something different from the previous release:
    # the manifest job refuses a note that is word for word the one before it.
    git commit -am "Daylo Lab 1.4.1: the version there is to update to"
    git tag v1.4.1 && git push origin main v1.4.1

## What to look at in each run

1. **Five Build jobs**, one per platform. Android is off here and shows as skipped.
2. **Updater manifest → Compose it.** It refuses if a platform is missing, if two artifacts
   claim one platform, or if the release note is empty, too long, or word for word the
   previous one. Five platforms in, Android not among them: the manifest has
   `windows-x86_64`, `windows-aarch64`, `darwin-x86_64`, `darwin-aarch64`, `linux-x86_64`.
3. **The address the app reads gives back this version.** This is the step that only a
   published release can answer, and the one this whole repository exists for. It asks
   `https://github.com/henfrydls/daylo-lab/releases/latest/download/latest.json` and
   compares what it says with the tag.
4. The `latest.json` attached to the release: five platforms, each with a `url` under this
   repository and a `signature`.

# The rehearsal that only a lab can do: a signature that does not match

Daylo refuses an update signed by anything other than the key inside it, and says so:
**"That update could not be verified, so nothing was installed."** Nobody should ever see
that sentence in the real app, which is exactly why it is worth seeing once here.

It is prepared and not run. The recipe, for when the ordinary path has been seen working:

1. Generate a second test key, apart from the one this repository publishes with.
2. Replace `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` in this
   repository's secrets with the second key. **The `pubkey` in `tauri.conf.json` does not
   change**: that is the whole point, the app keeps looking for the first key.
3. Tag `v1.4.2`. It builds and publishes exactly like the others.
4. A lab copy on 1.4.1 is offered 1.4.2, takes it, and stops with that sentence, having
   installed nothing. The app is still on 1.4.1 afterwards, which is the part worth
   checking.
5. Afterwards, delete the 1.4.2 release and put the first key back in the secrets, or every
   lab copy keeps being offered an update it will keep refusing.
